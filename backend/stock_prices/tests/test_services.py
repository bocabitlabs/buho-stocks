import logging
import pathlib

import responses
from rest_framework.test import APITestCase
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class CustomYServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()

    @responses.activate
    def test_fetch_stock_prices(
        self,
    ):
        response_text = ""
        with open(f"{pathlib.Path(__file__).parent.resolve()}/resp_text.txt", encoding="utf-8") as file:
            response_text = [x.strip() for x in file.readlines()]
        responses.add(
            responses.GET,
            "https://finance.yahoo.com/quote/CSCO/history",
            body=str(response_text),
            status=200,
        )
        service = YFinanceApiClient(wait_time=0)
        results, currency = service.get_company_data_between_dates("CSCO", "2022-01-16", "2022-01-31")
        self.assertEqual(currency, "USD")
        self.assertEqual(len(results), 9)
        result = results[4]
        self.assertIn("date", result)
        self.assertIn("close", result)
