from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
from markets.models import Market
from markets.tests.factory import MarketFactory


class MarketsListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.url = reverse("market-list")
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_markets(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            MarketFactory.create(user=self.user_saved)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_create_market(self):
        temp_data = factory.build(dict, FACTORY_CLASS=MarketFactory)
        response = self.client.post(self.url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["region"],
            temp_data["region"],
        )
        created_market = Market.objects.get(id=response.data["id"])
        self.assertEqual(created_market.user, self.user_saved)


class MarketsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        markets = []
        for _ in range(0, 4):
            market = MarketFactory.create(user=cls.user_saved)
            markets.append(market)
        cls.instances = markets

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_markets(self):
        index = 0
        url = reverse("market-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )
        self.assertEqual(
            response.data["description"],
            self.instances[index].description,
        )
        index = len(self.instances) - 1
        url = reverse("market-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )
        self.assertEqual(
            response.data["description"],
            self.instances[index].description,
        )

    def test_update_market(self):
        index = 0
        temp_data = factory.build(dict, FACTORY_CLASS=MarketFactory)
        url = reverse("market-detail", args=[self.instances[index].id])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["description"],
            temp_data["description"],
        )

    def test_delete_market(self):
        index = 0
        url = reverse("market-detail", args=[self.instances[index].id])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Market.DoesNotExist):
          Market.objects.get(id=self.instances[index].id)
