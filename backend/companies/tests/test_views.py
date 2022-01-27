from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
from companies.models import Company
from companies.tests.factory import CompanyFactory
from markets.tests.factory import MarketFactory
from portfolios.tests.factory import PortfolioFactory
from sectors.tests.factory import (
    SectorFactory,
)
import logging

logger = logging.getLogger("buho_backend")


class CompaniesListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_companies(self):
        portfolio = PortfolioFactory.create(user=self.user_saved)
        url = reverse("company-list", args=[portfolio.id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            CompanyFactory.create(user=self.user_saved, portfolio=portfolio)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class CompanisDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.portfolio = PortfolioFactory.create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = CompanyFactory.create(user=cls.user_saved, portfolio=cls.portfolio)
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_company(self):
        index = 0
        url = reverse("company-detail", args=[self.portfolio.id, self.instances[index].id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[index].color,
        )
        self.assertEqual(
            response.data["ticker"],
            self.instances[index].ticker,
        )
        index = len(self.instances) - 1
        url = reverse("company-detail", args=[self.portfolio.id, self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            response.data["broker"],
            self.instances[index].broker,
        )
        self.assertEqual(
            response.data["country_code"],
            self.instances[index].country_code,
        )

    def test_update_company(self):
        index = 0
        sector = SectorFactory.create(user=self.user_saved)
        market = MarketFactory.create(user=self.user_saved)
        temp_data = factory.build(dict, FACTORY_CLASS=CompanyFactory)
        temp_data["portfolio"] = self.portfolio.id
        temp_data["sector"] = sector.id
        temp_data["market"] = market.id

        url = reverse("company-detail", args=[self.portfolio.id, self.instances[index].id])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["ticker"],
            temp_data["ticker"],
        )
        self.assertEqual(
            response.data["country_code"],
            temp_data["country_code"],
        )

    def test_delete_company(self):
        url = reverse("company-detail", args=[self.portfolio.id, self.instances[0].id])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Company.DoesNotExist):
            Company.objects.get(id=self.instances[0].id)