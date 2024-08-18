from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from markets.tests.factory import MarketFactory


class MarketsListTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("markets-list")
        self.faker_obj = Faker()

    def test_get_markets(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            MarketFactory.create()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class MarketsDetailTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        markets = []
        for _ in range(0, 4):
            market = MarketFactory.create()
            markets.append(market)
        self.instances = markets

    def test_get_markets(self):
        index = 0
        url = reverse("markets-detail", args=[self.instances[index].id])
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
        url = reverse("markets-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )
        self.assertEqual(
            response.data["description"],
            self.instances[index].description,
        )
