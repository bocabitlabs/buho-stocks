import logging
from unittest import mock
from unittest.mock import patch

import pandas as pd
from rest_framework.test import APITestCase
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class MockTicker(object):
    fast_info = {"currency": "USD"}
    sort_values = mock.Mock(spec=pd.DataFrame)


def mocked_download(*args, **kwargs):
    # return some fake data here
    mocked_df = mock.Mock(spec=pd.DataFrame)
    mocked_df.shape = (10, 5)
    mocked_df.to_csv.return_value = "some csv data"
    return mocked_df


class CustomYServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()

    @patch("yfinance.Ticker")
    def test_fetch_currency(self, mock_ticker):
        mock_ticker.return_value = MockTicker()

        service = YFinanceApiClient(wait_time=0)
        currency = service.get_company_currency("CSCO")
        self.assertEqual(currency, "USD")

    @patch("yfinance.Ticker")
    @patch("yfinance.download")
    def test_fetch_stock_prices(self, mock_download, mock_ticker):
        # mock_ticker.return_value = MockTicker()
        # mock_download.return_value = MockTicker()
        mock_ticker.return_value.fast_info = {"currency": "USD"}
        # mock_ticker.return_value.history.return_value = {"Close": [100]}
        # create a mock dataframe with some dummy data for SPY and AAPL
        mock_df = pd.DataFrame({"Date": [200, 210, 220], "AAPL": [100, 110, 120], "Close": [100, 110, 120]})
        # make the mock object return the mock dataframe when called
        mock_download.return_value = mock_df
        # call your django view with AAPL as the argument
        # response = get_stock_price('AAPL')
        # assert that the response contains 100 as the stock price
        # self.assertEqual(response.data['price'], 100)
        # call your module that uses yf.download
        # result = data()
        # assert that the result is equal to the mock dataframe
        # self.assertEqual(result, mock_df)

        service = YFinanceApiClient(wait_time=0)
        results, currency = service.get_company_data_between_dates("CSCO", "2022-01-16", "2022-01-31")
        self.assertEqual(currency, "USD")
        logger.debug(f"results: {results}")
        self.assertEqual(len(results), 3)
        # result = results[4]
        # self.assertIn("date", result)
        # self.assertIn("close", result)
