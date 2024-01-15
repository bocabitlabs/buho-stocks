import logging
from decimal import Decimal

import responses
from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from exchange_rates.models import ExchangeRate
from exchange_rates.tests.factory import ExchangeRateFactory

logger = logging.getLogger("buho_backend")


class ExchangeRatesListTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("exchangerate-list")
        self.faker_obj = Faker()

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


class ExchangeRatesDetailTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        instances = []
        for _ in range(0, 4):
            instance = ExchangeRateFactory.create()
            instances.append(instance)
        self.instances = instances

    @responses.activate
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
        # Check status response
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
