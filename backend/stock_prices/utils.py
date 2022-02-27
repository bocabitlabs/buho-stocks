from companies.models import Company
from companies.utils import CompanyUtils
from stock_prices.api import StockPricesApi
from stock_prices.services.custom_yfinance_service import CustomYFinanceService


class StockPricesUtils:
    def __init__(self, company: Company, year: str):
        self.company = company
        self.year = year

    def get_stock_price_for_tickers(self, tickers: list):
        api_service = CustomYFinanceService()
        api = StockPricesApi(api_service)
        for ticker in tickers.split(","):
            stock_price = api.get_last_data_from_last_month(ticker)
            if stock_price:
                return stock_price
        return None

    def get_year_last_stock_price(self):
        api_service = CustomYFinanceService()
        api = StockPricesApi(api_service)
        if self.year == "all":
            stock_price = api.get_last_data_from_last_month(self.company.ticker)
            if not stock_price:
                stock_price = self.get_stock_price_for_tickers(self.company.alt_tickers)

        else:
            first_year = CompanyUtils(self.company.id).get_company_first_year(
                self.company.user
            )
            if not first_year or first_year > int(self.year):
                return None
            stock_price = api.get_last_data_from_year(self.company.ticker, self.year)
            if not stock_price:
                stock_price = self.get_stock_price_for_tickers(self.company.alt_tickers)
        return stock_price

