from decimal import Decimal
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
from exchange_rates.models import ExchangeRate
from exchange_rates.tests.factory import ExchangeRateFactory
import logging

logger = logging.getLogger("buho_backend")


class ExchangeRatesListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.url = reverse("exchange-rates-list")
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_exchange_rates(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            ExchangeRateFactory.create()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class ExchangeRatesDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = ExchangeRateFactory.create()
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_exchange_rate(self):
        index = 0
        self.assertEqual(len(ExchangeRate.objects.all()), 4)
        url = reverse(
            "exchange-rates-detail",
            args=[
                self.instances[index].exchange_from,
                self.instances[index].exchange_to,
                self.instances[index].exchange_date,
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
            "exchange-rates-detail",
            args=[
                self.instances[index].exchange_from,
                self.instances[index].exchange_to,
                self.instances[index].exchange_date,
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
