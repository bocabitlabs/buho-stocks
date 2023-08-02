import logging
import pathlib
from os import path

import responses
from rest_framework.test import APITestCase
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class CustomYServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()

    # @patch("yfinance.Ticker")
    # @_recorder.record(file_path="out.yaml")
    @responses.activate
    def test_fetch_currency(self):
        responses_path = path.join(
            pathlib.Path(__file__).parent.parent,
            "responses",
            "out_download.yaml",
        )
        responses.patch("https://query2.finance.yahoo.com")
        responses._add_from_file(file_path=responses_path)

        service = YFinanceApiClient(wait_time=0)
        currency = service.get_company_currency("CSCO")
        self.assertEqual(currency, "USD")

    # @responses._recorder.record(file_path="out_download.yaml")
    @responses.activate
    def test_fetch_stock_prices(self):
        responses_path = path.join(
            pathlib.Path(__file__).parent.parent,
            "responses",
            "out_download.yaml",
        )
        responses.patch("https://query2.finance.yahoo.com")
        responses._add_from_file(file_path=responses_path)

        service = YFinanceApiClient(wait_time=0)
        results, currency = service.get_company_data_between_dates("CSCO", "2022-01-16", "2022-01-31")
        self.assertEqual(currency, "USD")
        self.assertEqual(len(results), 9)
