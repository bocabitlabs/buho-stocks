from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
import logging
from currencies.views.admin import create_initial_currencies
from portfolios.models import Portfolio

from portfolios.tests.factory import PortfolioFactory

logger = logging.getLogger("buho_backend")


class PortfoliosListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        create_initial_currencies()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.url = reverse("portfolio-list")
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_portfolios(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            PortfolioFactory.create(user=self.user_saved)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_create_portfolio(self):
        temp_data = factory.build(dict, FACTORY_CLASS=PortfolioFactory)
        response = self.client.post(self.url, temp_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        self.assertEqual(
            response.data["base_currency"],
            temp_data["base_currency"],
        )
        created_instance = Portfolio.objects.get(id=response.data["id"])
        self.assertEqual(created_instance.user, self.user_saved)
        self.assertEqual(len(response.data["companies"]), 0)


class PortfoliosDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        create_initial_currencies()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = PortfolioFactory.create(user=cls.user_saved)
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_portfolio(self):
        url = reverse("portfolio-detail", args=[self.instances[0].id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[0].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[0].color,
        )
        self.assertEqual(
            response.data["base_currency"]["code"],
            self.instances[0].base_currency,
        )
        index = len(self.instances) - 1
        url = reverse("portfolio-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[index].color,
        )
        self.assertEqual(
            response.data["base_currency"]["code"],
            self.instances[index].base_currency,
        )

    def test_update_portfolio(self):
        temp_data = factory.build(dict, FACTORY_CLASS=PortfolioFactory)
        url = reverse("portfolio-detail", args=[self.instances[0].id])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        self.assertEqual(
            response.data["description"],
            temp_data["description"],
        )

    def test_delete_portfolio(self):
        url = reverse("portfolio-detail", args=[self.instances[0].id])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Portfolio.DoesNotExist):
            Portfolio.objects.get(id=self.instances[0].id)
