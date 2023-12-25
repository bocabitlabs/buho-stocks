import datetime
import logging
from typing import List, Optional

from buho_backend.settings.common import YEAR_FOR_ALL
from companies.models import Company
from companies.utils import get_company_first_year
from stock_prices.models import StockPrice
from stock_prices.services.stock_prices_service import StockPricesService

logger = logging.getLogger("buho_backend")


class CompanyStockPriceFetcher:
    def __init__(self, company: Company, year: int, update_api_price=False):
        self.company = company
        self.year = year
        self.update_api_price = update_api_price

    def get_stock_price_of_multiple_tickers(self, tickers: Optional[str]) -> Optional[StockPrice]:
        logger.debug(f"Fetching stock price for {tickers}")
        stock_price_service = StockPricesService()
        if tickers:
            for ticker in tickers.split(","):
                stock_price = stock_price_service.get_last_data_from_last_month(ticker)
                if stock_price:
                    return stock_price
        return None

    def get_year_last_stock_price(self) -> Optional[StockPrice]:
        from_date, to_date = self.get_start_end_dates_for_year(self.year)
        stock_price = self.get_last_stock_price_from_db_of_year(self.company.ticker, from_date, to_date)

        if not stock_price or self.update_api_price:
            stock_price_service = StockPricesService()

            if self.year == YEAR_FOR_ALL:
                stock_price = stock_price_service.get_last_data_from_last_month(self.company.ticker)
                if not stock_price:
                    stock_price = self.get_stock_price_of_multiple_tickers(self.company.alt_tickers)

            else:
                first_year = get_company_first_year(self.company.id)
                if not first_year or first_year > int(self.year):
                    return None

                stock_prices = self.get_last_stock_prices_from_db_of_year(self.company.ticker, from_date, to_date)
                if stock_prices.count() > 0 and not self.update_api_price:
                    stock_price = stock_prices[0]
                else:
                    logger.debug(f"Fetching stock price for {self.company.ticker} in {self.year}")

                    stock_price = stock_price_service.get_last_data_from_year(
                        self.company.ticker, from_date, to_date, update_api_price=self.update_api_price
                    )
                    if not stock_price:
                        stock_price = self.get_stock_price_of_multiple_tickers(self.company.alt_tickers)
        return stock_price

    def get_last_stock_price_from_db_of_year(self, ticker: str, from_date: str, to_date: str) -> List[StockPrice]:
        prices = StockPrice.objects.filter(ticker=ticker, transaction_date__range=[from_date, to_date]).order_by(
            "-transaction_date"
        )

        return prices[0]

    def get_start_end_dates_for_year(self, year: int) -> tuple[str, str]:
        todays_date = datetime.date.today()
        if todays_date.year == int(year):
            # Get today minus 15 days
            from_date = (todays_date - datetime.timedelta(days=15)).strftime("%Y-%m-%d")
            to_date = todays_date.strftime("%Y-%m-%d")
        else:
            from_date = f"{year}-12-01"
            to_date = f"{year}-12-31"
        return from_date, to_date
