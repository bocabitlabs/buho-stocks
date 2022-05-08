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

"""     @patch(
        "stock_prices.services.custom_yfinance_service.CustomYFinanceService.request_from_api"
    )
    def test_update_stock_price_transaction(
        self,
        mock_request,
    ):
        index = 0
        temp_data = factory.build(dict, FACTORY_CLASS=StockPriceTransactionFactory)
        temp_data["ticker"] = self.company.ticker
        temp_data["price_currency"] = self.company.base_currency
        stock_price_year = temp_data["transaction_date"].year

        mock_request.return_value = (
            [
                {
                    "close": temp_data["price"],
                    "ticker": self.company.ticker,
                    "date": time.mktime(temp_data["transaction_date"].timetuple()),
                },
            ],
            temp_data["price_currency"],
        )
        url = reverse("stock-prices-year", args=[self.company.id, stock_price_year])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["ticker"],
            temp_data["ticker"],
        )
        self.assertEqual(
            response.data["transaction_date"],
            temp_data["transaction_date"].strftime("%Y-%m-%d"),
        )
        self.assertEqual(
            Decimal(response.data["price"]),
            temp_data["price"],
        )
        self.assertEqual(
            response.data["price_currency"],
            temp_data["price_currency"],
        ) """
