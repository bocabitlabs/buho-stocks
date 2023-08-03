from unittest.mock import patch

from rest_framework.test import APITestCase
from stock_prices.tests.mocks.mock_yfinance import create_download_mock_2, create_ticker_mock_2


class BaseApiTestCase(APITestCase):
    def setUp(self):
        self.patch_ticker = patch("yfinance.Ticker")
        self.patch_download = patch("yfinance.download")

        self.mock_ticker = self.patch_ticker.start()
        self.mock_download = self.patch_download.start()

        self.set_mock_ticker_result(create_ticker_mock_2())
        self.set_mock_download_result(create_download_mock_2())

    def tearDown(self):
        self.patch_ticker.stop()
        self.patch_download.stop()

    def set_mock_ticker_result(self, result):
        self.mock_ticker.return_value = result

    def set_mock_download_result(self, result):
        self.mock_download.return_value = result
