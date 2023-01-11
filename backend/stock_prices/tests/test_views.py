from decimal import Decimal
import time
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from auth.tests.factory import UserFactory
from companies.tests.factory import CompanyFactory
import logging
import factory

from stock_prices.tests.factory import StockPriceTransactionFactory

logger = logging.getLogger("buho_backend")


class StockPricesTransactionsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.company = CompanyFactory.create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = StockPriceTransactionFactory.create(
                price_currency=cls.company.base_currency
            )
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)
