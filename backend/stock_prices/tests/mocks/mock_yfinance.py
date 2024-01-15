from unittest import mock

import pandas as pd


class MockTicker(object):
    fast_info = {"currency": "USD"}
    sort_values = mock.Mock(spec=pd.DataFrame)


def create_ticker_mock() -> MockTicker:
    return MockTicker()


def create_download_mock_df() -> pd.DataFrame:
    """Create a mock dataframe with some dummy data for AAPL

    Returns:
        DataFrame: A dataframe with some dummy data
    """
    mock_df = pd.DataFrame(
        {"Date": [200, 210, 220], "AAPL": [100, 110, 120], "Close": [100, 110, 120]}
    )
    return mock_df


def create_empty_download_mock_df() -> pd.DataFrame:
    """Create a mock dataframe with some dummy data for AAPL

    Returns:
        DataFrame: A dataframe with some dummy data
    """
    mock_df = pd.DataFrame({"Date": [], "AAPL": [], "Close": []})
    return mock_df


def create_download_mock():
    return create_download_mock_df()
