from typing import Optional

from companies.models import Company
from companies.utils import CompanyUtils
from stock_prices.api import StockPricesApi
from stock_prices.services.yfinance_api_client import YFinanceApiClient


class StockPricesUtils:
    def __init__(self, company: Company, year: int):
        self.company = company
        self.year = year

    def get_stock_price_for_tickers(self, tickers: Optional[str]) -> Optional[dict]:
        """Get the stock price for a list of tickers.
        It will only return the first ticker that has a stock price.

        Args:
            tickers (list[str]): List of tickers (strings)

        Returns:
            dict: The dictionary with the stock price
        """
        api_service = YFinanceApiClient()
        api = StockPricesApi(api_service)
        if tickers:
            for ticker in tickers.split(","):
                stock_price = api.get_last_data_from_last_month(ticker)
                if stock_price:
                    return stock_price
        return None

    def get_year_last_stock_price(self):
        api_service = YFinanceApiClient()
        api = StockPricesApi(api_service)

        if self.year == 9999:
            stock_price = api.get_last_data_from_last_month(self.company.ticker)
            if not stock_price:
                stock_price = self.get_stock_price_for_tickers(self.company.alt_tickers)

        else:
            company_utils = CompanyUtils(self.company.id)
            first_year = company_utils.get_company_first_year()
            if not first_year or first_year > int(self.year):
                return None
            stock_price = api.get_last_data_from_year(self.company.ticker, self.year)
            if not stock_price:
                stock_price = self.get_stock_price_for_tickers(self.company.alt_tickers)
        return stock_price
