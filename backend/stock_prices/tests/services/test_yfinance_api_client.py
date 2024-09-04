import logging

from buho_backend.tests.base_test_case import BaseApiTestCase
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class CustomYServiceTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()

    def test_fetch_currency(self):
        service = YFinanceApiClient(wait_time=0)
        currency = service.get_company_currency("CSCO")
        self.assertEqual(currency, "USD")

    def test_fetch_stock_prices(self):
        service = YFinanceApiClient(wait_time=0)
        results, currency = service.get_company_data_between_dates(
            "CSCO", "2022-01-16", "2022-01-31"
        )
        self.assertEqual(currency, "USD")
        self.assertEqual(len(results), 3)
