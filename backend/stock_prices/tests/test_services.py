from decimal import Decimal
import pathlib
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
import responses
from stock_prices.services.custom_yfinance_service import CustomYFinanceService

from stock_prices.tests.factory import StockPriceTransactionFactory

logger = logging.getLogger("buho_backend")


class CustomYServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()

    @responses.activate
    def test_fetch_stock_prices(
        self,
    ):
        response_text = ""
        with open(f"{pathlib.Path(__file__).parent.resolve()}/resp_text.txt") as f:
          response_text = [x.strip() for x in f.readlines()]
        logger.debug(response_text)
        responses.add(
            responses.GET,
            "https://finance.yahoo.com/quote/CSCO/history",
            body=str(response_text),
            status=200,
        )
        service = CustomYFinanceService(wait_time=0)
        results, currency = service.request_from_api("CSCO", "2022-01-16","2022-01-31")
        self.assertEqual(currency, "USD")
        self.assertEqual(len(results), 9)
        result = results[4]
        logger.debug(result)
        self.assertIn("date", result)
        self.assertIn("close", result)
