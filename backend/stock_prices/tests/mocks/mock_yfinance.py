from unittest import mock

import pandas as pd


class MockTicker(object):
    info = {"currency": "USD"}
    sort_values = mock.Mock(spec=pd.DataFrame)


def create_ticker_mock(mock_ticker) -> MockTicker:
    mock_ticker.return_value = MockTicker()
    return mock_ticker


def create_ticker_mock_2() -> MockTicker:
    return MockTicker()


def create_download_mock_df() -> pd.DataFrame:
    """Create a mock dataframe with some dummy data for AAPL

    Returns:
        DataFrame: A dataframe with some dummy data
    """
    mock_df = pd.DataFrame({"Date": [200, 210, 220], "AAPL": [100, 110, 120], "Close": [100, 110, 120]})
    return mock_df


def create_empty_download_mock_df() -> pd.DataFrame:
    """Create a mock dataframe with some dummy data for AAPL

    Returns:
        DataFrame: A dataframe with some dummy data
    """
    mock_df = pd.DataFrame({"Date": [], "AAPL": [], "Close": []})
    return mock_df


def create_download_mock(mock_download):
    mock_df = create_download_mock_df()
    mock_download.return_value = mock_df
    return mock_download


def create_download_mock_2():
    return create_download_mock_df()
