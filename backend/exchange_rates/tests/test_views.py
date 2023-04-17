import logging
from decimal import Decimal

from django.urls import reverse
from exchange_rates.models import ExchangeRate
from exchange_rates.tests.factory import ExchangeRateFactory
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase

logger = logging.getLogger("buho_backend")


class ExchangeRatesListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.url = reverse("exchangerate-list")
        cls.faker_obj = Faker()

    def test_get_exchange_rates(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

        for _ in range(0, 4):
            ExchangeRateFactory.create()

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)


class ExchangeRatesDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        instances = []
        for _ in range(0, 4):
            instance = ExchangeRateFactory.create()
            instances.append(instance)
        cls.instances = instances

    def test_get_exchange_rate(self):
        index = 0
        self.assertEqual(len(ExchangeRate.objects.all()), 4)
        url = reverse(
            "exchange-rates-details",
            args=[
                self.instances[index].exchange_from,
                self.instances[index].exchange_to,
                self.instances[index].exchange_date.strftime("%Y-%m-%d"),
            ],
        )
        response = self.client.get(url)
        # # # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["exchange_from"],
            self.instances[index].exchange_from,
        )
        self.assertEqual(
            response.data["exchange_to"],
            self.instances[index].exchange_to,
        )
        self.assertEqual(
            Decimal(response.data["exchange_rate"]),
            self.instances[index].exchange_rate,
        )
        self.assertEqual(
            response.data["exchange_date"],
            self.instances[index].exchange_date.strftime("%Y-%m-%d"),
        )
        index = len(self.instances) - 1
        url = reverse(
            "exchange-rates-details",
            args=[
                self.instances[index].exchange_from,
                self.instances[index].exchange_to,
                self.instances[index].exchange_date.strftime("%Y-%m-%d"),
            ],
        )
        response = self.client.get(url)
        self.assertEqual(
            response.data["exchange_from"],
            self.instances[index].exchange_from,
        )
        self.assertEqual(
            response.data["exchange_to"],
            self.instances[index].exchange_to,
        )
        self.assertEqual(
            Decimal(response.data["exchange_rate"]),
            self.instances[index].exchange_rate,
        )
        self.assertEqual(
            response.data["exchange_date"],
            self.instances[index].exchange_date.strftime("%Y-%m-%d"),
        )
