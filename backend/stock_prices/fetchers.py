import datetime
import logging
from typing import Optional

from django.conf import settings

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

    def get_year_last_stock_price(self) -> Optional[StockPrice]:
        from_date, to_date = self.get_start_end_dates_for_year(self.year)
        from_date_datetime = datetime.datetime.strptime(from_date, "%Y-%m-%d")
        to_date_datetime = datetime.datetime.strptime(to_date, "%Y-%m-%d")
        stock_price = self.get_last_stock_price_from_db_of_year(
            self.company.ticker, from_date, to_date
        )

        if not stock_price or self.update_api_price:
            stock_price_service = StockPricesService()

            if self.year == settings.YEAR_FOR_ALL:
                stock_price = stock_price_service.get_last_data_from_last_month(
                    self.company.ticker
                )
            else:
                first_year = get_company_first_year(self.company.id)
                if not first_year or first_year > int(self.year):
                    return None

                stock_price = self.get_last_stock_price_from_db_of_year(
                    self.company.ticker, from_date, to_date
                )

                if not stock_price or self.update_api_price:
                    logger.debug(
                        f"Fetching stock price for {self.company.ticker} in {self.year}"
                    )

                    stock_price = stock_price_service.get_last_data_from_year(
                        self.company.ticker,
                        from_date_datetime,
                        to_date_datetime,
                        update_api_price=self.update_api_price,
                    )

        return stock_price

    def get_last_stock_price_from_db_of_year(
        self, ticker: str, from_date: str, to_date: str
    ) -> StockPrice | None:
        prices = StockPrice.objects.filter(
            ticker=ticker, transaction_date__range=[from_date, to_date]
        ).order_by("-transaction_date")

        if prices.count() > 0:
            last_price: StockPrice = prices[0]
            return last_price
        return None

    def get_start_end_dates_for_year(self, year: int) -> tuple[str, str]:
        todays_date = datetime.date.today()

        if self.company.is_closed:
            from_date, to_date = self.get_start_end_dates_from_last_sell(year)
            if from_date and to_date:
                return from_date, to_date

        if todays_date.year == int(year):
            # Get today minus 15 days
            from_date = (todays_date - datetime.timedelta(days=15)).strftime("%Y-%m-%d")
            to_date = todays_date.strftime("%Y-%m-%d")
        else:
            from_date = f"{year}-12-01"
            to_date = f"{year}-12-31"
        return from_date, to_date

    def get_start_end_dates_from_last_sell(
        self, year: int
    ) -> tuple[str, str] | tuple[None, None]:
        last_transaction = self.company.shares_transactions.filter(type="SELL").last()

        if not last_transaction:
            raise ValueError("Company has no sell transactions")

        if int(year) >= last_transaction.transaction_date.year:
            # Dates from the last transaction
            from_date = last_transaction.transaction_date.strftime("%Y-%m-%d")
            # to_date is the next day to the last transaction
            to_date = (
                last_transaction.transaction_date + datetime.timedelta(days=1)
            ).strftime("%Y-%m-%d")

            return from_date, to_date

        return None, None
