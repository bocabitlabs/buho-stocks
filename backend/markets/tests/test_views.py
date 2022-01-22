from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
from markets.tests.factory import MarketFactory

class MarketsListTestCase(APITestCase):

    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.url = reverse('market-list')
        cls.faker_obj = Faker()


    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_markets(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0,4):
          MarketFactory.create(user=self.user_saved)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_create_market(self):
      # temp_market = MarketFactory.build(user=self.user_saved)
      temp_data = factory.build(dict, FACTORY_CLASS=MarketFactory, user=self.user_saved)
      response = self.client.post(self.url, temp_data)
      # Check status response
      self.assertEqual(response.status_code, status.HTTP_201_CREATED)
      self.assertEqual(
          response.data['name'],
          temp_data["name"],
      )
      self.assertEqual(
          response.data['region'],
          temp_data["region"],
      )


class MarketsDetailTestCase(APITestCase):

    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        markets = []
        for _ in range(0,4):
          market = MarketFactory.create(user=cls.user_saved)
          markets.append(market)
        cls.markets = markets

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_markets(self):
        url = reverse('market-detail', args=[1])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            self.markets[0].name,
        )
        self.assertEqual(
            response.data['description'],
            self.markets[0].description,
        )
        url = reverse('market-detail', args=[4])
        response = self.client.get(url)
        self.assertEqual(
            response.data['name'],
            self.markets[len(self.markets)-1].name,
        )
        self.assertEqual(
            response.data['description'],
            self.markets[len(self.markets)-1].description,
        )
