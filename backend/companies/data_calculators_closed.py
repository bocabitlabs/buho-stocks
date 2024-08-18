import datetime
import logging
from decimal import Decimal

from django.conf import settings

from companies.data_calculators import CompanyDataCalculator
from exchange_rates.services.exchange_rate_fetcher import ExchangeRateFetcher
from stock_prices.fetchers import CompanyStockPriceFetcher

logger = logging.getLogger("buho_backend")


class CompanyClosedDataCalculator(CompanyDataCalculator):
    def __init__(self, args, **kwargs):
        super().__init__(args, **kwargs)
        self.last_transaction = self.company.shares_transactions.filter(
            type="SELL"
        ).last()

    def calculate_total_invested_on_year_for_portfolio(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)

        total += self.shares_calculator.calculate_invested_on_year(year)
        total += self.rights_calculator.calculate_invested_on_year(year)
        return total

    def calculate_total_invested_on_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)

        shares_count = self.shares_calculator.calculate_shares_count_until_year(year)

        if shares_count == 0:
            return Decimal(0)

        total += self.shares_calculator.calculate_invested_on_year(year)
        total += self.rights_calculator.calculate_invested_on_year(year)
        return total

    def calculate_accumulated_investment_until_year_for_portfolio(
        self, year: int
    ) -> Decimal:
        total: Decimal = Decimal(0)

        # Any year after the last sell transaction year
        if (
            int(year) >= self.last_transaction.transaction_date.year
            and year != settings.YEAR_FOR_ALL
        ):
            return Decimal(0)

        # Years before the last sell transaction
        else:
            total += self.shares_calculator.calculate_accumulated_investment_until_year(
                year
            )
            total += self.rights_calculator.calculate_accumulated_investment_until_year(
                year
            )
            logger.debug(f"Total accum on year {year}: {total}")
        return total

    def calculate_accumulated_investment_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)

        # Any year after the last sell transaction year
        if (
            int(year) >= self.last_transaction.transaction_date.year
            and year != settings.YEAR_FOR_ALL
        ):
            return Decimal(0)
        # YEAR_FOR_ALL
        if (
            int(year) == settings.YEAR_FOR_ALL
            or int(year) < self.last_transaction.transaction_date.year
        ):
            total = self.shares_calculator.calculate_accumulated_investment_until_year_excluding_last_sale(  # noqa
                year
            )
            return total
        # Years before the last sell transaction
        if int(year) < self.last_transaction.transaction_date.year:
            total += self.shares_calculator.calculate_accumulated_investment_until_year(
                year
            )
            total += self.rights_calculator.calculate_accumulated_investment_until_year(
                year
            )
            logger.debug(f"Total accum on year {year}: {total}")

        return total

    def calculate_company_value_on_year_for_portfolio(self, year: int) -> Decimal:
        total = Decimal(0)

        # year < last_transaction
        # normal
        if int(year) < self.last_transaction.transaction_date.year:
            logger.debug("Year is before last sell")
            return super().calculate_company_value_on_year(year)

        return total

    def calculate_company_value_on_year(self, year: int) -> Decimal:
        total = Decimal(0)

        # year < last_transaction
        # normal
        if int(year) < self.last_transaction.transaction_date.year:
            logger.debug("Year is before last sell")
            return super().calculate_company_value_on_year(year)
        # year > last_transaction and != YEAR_FOR_ALL
        # 0
        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year != settings.YEAR_FOR_ALL
        ):
            logger.debug("Year is after last sell and not ALL")
            return Decimal(0)

        # year > last_transaction and == YEAR_FOR_ALL
        # or year == last_transaction
        # get the value from last sell * exchange rate
        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year == settings.YEAR_FOR_ALL
        ) or (int(year) == self.last_transaction.transaction_date.year):
            logger.debug("Year is the same as last sell or ALL")
            exchange_rates_fetcher = ExchangeRateFetcher()
            datetime_from_date = datetime.datetime.combine(
                self.last_transaction.transaction_date, datetime.datetime.min.time()
            )
            exchange_rate = exchange_rates_fetcher.get_exchange_rate_for_date(
                self.company.base_currency,
                self.company.portfolio.base_currency,
                datetime_from_date,
            )
            if exchange_rate:
                total = self.last_transaction.total_amount.amount * Decimal(
                    exchange_rate.exchange_rate
                )

        return total

    def _calculate_company_value_with_last_stock_price(
        self, year, shares_count
    ) -> Decimal:
        total = Decimal(0)

        current_year = year
        if year == settings.YEAR_FOR_ALL:
            current_year = datetime.date.today().year

        stock_price_fetcher = CompanyStockPriceFetcher(
            self.company, current_year, update_api_price=False
        )
        stock_price = stock_price_fetcher.get_year_last_stock_price()
        if stock_price:
            price = stock_price.price.amount
            transaction_date = stock_price.transaction_date
            datetime_from_date = datetime.datetime.combine(
                transaction_date, datetime.datetime.min.time()
            )

            exchange_rates_fetcher = ExchangeRateFetcher()

            exchange_rate = exchange_rates_fetcher.get_exchange_rate_for_date(
                self.company.base_currency,
                self.company.portfolio.base_currency,
                datetime_from_date,
            )
            if exchange_rate:
                total = (
                    Decimal(price) * shares_count * Decimal(exchange_rate.exchange_rate)
                )
        return total

    def calculate_return_on_year(self, year: int) -> Decimal:
        # year < last_transaction
        # normal
        if int(year) < self.last_transaction.transaction_date.year:
            logger.debug("Year is before last sell")
            return super().calculate_return_on_year(year)
        # year > last_transaction and != YEAR_FOR_ALL
        # 0
        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year != settings.YEAR_FOR_ALL
        ):
            logger.debug("Year is after last sell and not ALL")
            return Decimal(0)

        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year == settings.YEAR_FOR_ALL
        ) or (int(year) == self.last_transaction.transaction_date.year):
            accum_investment = self.shares_calculator.calculate_accumulated_investment_until_year_excluding_last_sale(  # noqa
                year
            )

            company_value = self.calculate_company_value_on_year(year)

            total = company_value - accum_investment

        return total

    def calculate_return_with_dividends_on_year(self, year: int) -> Decimal:
        # year < last_transaction
        # normal
        if int(year) < self.last_transaction.transaction_date.year:
            logger.debug("Year is before last sell")
            return super().calculate_return_with_dividends_on_year(year)
        # year > last_transaction and != YEAR_FOR_ALL
        # 0
        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year != settings.YEAR_FOR_ALL
        ):
            logger.debug("Year is after last sell and not ALL")
            return Decimal(0)

        elif (
            int(year) > self.last_transaction.transaction_date.year
            and year == settings.YEAR_FOR_ALL
        ) or (int(year) == self.last_transaction.transaction_date.year):
            accum_investment = self.shares_calculator.calculate_accumulated_investment_until_year_excluding_last_sale(  # noqa
                year
            )

            company_value = self.calculate_company_value_on_year(year)
            accumulated_dividends = self.calculate_accumulated_dividends_until_year(
                year
            )

        return company_value - accum_investment + accumulated_dividends

    def calculate_return_yield_on_year(self, year: int) -> Decimal:
        return_value = self.calculate_return_on_year(year)

        if (
            int(year) == self.last_transaction.transaction_date.year
            or year == settings.YEAR_FOR_ALL
        ) or (int(year) == self.last_transaction.transaction_date.year):
            total_invested = self.shares_calculator.calculate_accumulated_investment_until_year_excluding_last_sale(  # noqa
                year
            )
        else:
            total_invested = self.calculate_accumulated_investment_until_year(year)

        if total_invested != 0:
            return (return_value / total_invested) * 100
        return Decimal(0)

    def calculate_return_yield_with_dividends_on_year(self, year: int) -> Decimal:
        return_with_dividends = self.calculate_return_with_dividends_on_year(year)
        if (
            int(year) == self.last_transaction.transaction_date.year
            or year == settings.YEAR_FOR_ALL
        ) or (int(year) == self.last_transaction.transaction_date.year):
            total_invested = self.shares_calculator.calculate_accumulated_investment_until_year_excluding_last_sale(  # noqa
                year
            )
        else:
            total_invested = self.calculate_accumulated_investment_until_year(year)

        if total_invested != 0:
            return (return_with_dividends / total_invested) * 100
        return Decimal(0)
