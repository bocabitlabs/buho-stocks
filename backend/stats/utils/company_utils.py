from decimal import Decimal
import logging
from django.contrib.auth.models import User
from django.utils import timezone
from companies.models import Company
from companies.utils import CompanyUtils
from exchange_rates.utils import ExchangeRatesUtils
from stats.models.company_stats import CompanyStatsForYear
from stock_prices.utils import StockPricesUtils


logger = logging.getLogger("buho_backend")


class CompanyStatsUtils:

    year_for_all = 9999


    def __init__(
        self,
        company_id: int,
        user_id: int,
        year="all",
        use_currency="portfolio",
        force: bool = False,
    ):
        self.company = Company.objects.get(id=company_id, user=user_id)
        self.year = year
        self.use_currency = use_currency
        self.user_id = user_id
        self.force = force
        self.company_utils = CompanyUtils(
            self.company.id, use_currency=self.use_currency
        )

        self.stock_prices_utils = StockPricesUtils(self.company, self.year)
        self.exchange_rates_utils = ExchangeRatesUtils(use_currency=self.use_currency)

    def get_portfolio_value(self, stock_price, shares_count):
        price = 0
        exchange_rate_value = 0
        if shares_count > 0 and stock_price:
            price = stock_price["price"]
            transaction_date = stock_price["transaction_date"]
            exchange_rate_value = self.exchange_rates_utils.get_exchange_rate_for_date(
                self.company.base_currency,
                self.company.portfolio.base_currency,
                transaction_date,
            )
        total = Decimal(price) * shares_count * Decimal(exchange_rate_value)
        return total

    def get_return_with_dividends(
        self, portfolio_value, accumulated_dividends, total_invested
    ):
        total = 0
        if portfolio_value:
            total = portfolio_value - total_invested + accumulated_dividends
        return total

    def get_return(self, portfolio_value, total_invested):
        total = 0
        if portfolio_value:
            total = portfolio_value - total_invested
        return total

    def get_return_percent(self, total_return, total_invested):
        total = 0
        if total_invested != 0:
            total = total_return / total_invested * 100
        return total

    def get_dividends_yield(self, dividends, portfolio_value):
        total = 0
        if portfolio_value != 0:
            logger.debug("Calculating dividends yield")
            logger.debug(f"Dividends: {dividends}")
            logger.debug(f"Portfolio value: {portfolio_value}")
            total = dividends / portfolio_value * 100 if portfolio_value else 0
        return total

    def get_stats_for_year_from_db(self, year: int):
        if CompanyStatsForYear.objects.filter(company=self.company, year=year).exists():
            company_stats_for_year = CompanyStatsForYear.objects.get(
                company=self.company, year=year
            )
            return company_stats_for_year
        return None

    def calculate_stats_for_year(self, year: int):

        accum_shares_count = (
            self.company_utils.get_accumulated_shares_count_until_year(year)
        )
        total_invested = self.company_utils.get_total_invested_on_year(year)
        dividends = self.company_utils.dividends_utils.get_dividends_of_year(year)
        accumulated_investment = (
            self.company_utils.get_accumulated_investment_until_year(year)
        )
        accumulated_dividends = (
            self.company_utils.dividends_utils.get_accumulated_dividends_until_year(year)
        )
        last_stock_price = self.stock_prices_utils.get_year_last_stock_price()
        # Calculated values
        portfolio_value = self.get_portfolio_value(last_stock_price, accum_shares_count)
        return_value = self.get_return(portfolio_value, accumulated_investment)
        return_percent = self.get_return_percent(return_value, accumulated_investment)
        return_with_dividends = self.get_return_with_dividends(
            portfolio_value, accumulated_dividends, accumulated_investment
        )
        return_with_dividends_percent = self.get_return_percent(
            return_with_dividends, accumulated_investment
        )
        if year == self.year_for_all:
            dividends_yield = self.get_dividends_yield(accumulated_dividends, portfolio_value)
        else:
            dividends_yield = self.get_dividends_yield(dividends, portfolio_value)

        # Fixes
        last_stock_price_value = last_stock_price["price"] if last_stock_price else 0
        last_stock_price_currency = (
            last_stock_price["price_currency"] if last_stock_price else ""
        )
        last_stock_price_transaction_date = (
            last_stock_price["transaction_date"]
            if last_stock_price
            else f"{year}-01-01"
        )
        portfolio_currency = self.company.portfolio.base_currency
        portfolio_is_down = portfolio_value < accumulated_investment

        results_dict = {
            "shares_count": accum_shares_count,
            "invested": total_invested,
            "dividends": dividends,
            "portfolio_currency": portfolio_currency,
            "accumulated_investment": accumulated_investment,
            "accumulated_dividends": accumulated_dividends,
            "stock_price_value": last_stock_price_value,
            "stock_price_currency": last_stock_price_currency,
            "stock_price_transaction_date": last_stock_price_transaction_date,
            "portfolio_value": portfolio_value,
            "portfolio_value_is_down": portfolio_is_down,
            "return_value": return_value,
            "dividends_yield": dividends_yield,
            "return_percent": return_percent,
            "return_with_dividends": return_with_dividends,
            "return_with_dividends_percent": return_with_dividends_percent,
        }
        return results_dict

    def update_or_create_stats_for_year(self, year: int, results: dict):
        if CompanyStatsForYear.objects.filter(company=self.company, year=year).exists():
            company_stats_for_year = CompanyStatsForYear.objects.get(
                company=self.company, year=year
            )
            company_stats_for_year.delete()
            # Create a new CompanyStatsForYear
        instance = CompanyStatsForYear.objects.create(
            user=User.objects.get(id=self.user_id),
            company=self.company,
            year=year,
            **results,
        )
        return instance

    def get_stats_for_year(self):

        temp_year = self.year_for_all if self.year == "all" else self.year

        if not self.force:
            instance = self.get_stats_for_year_from_db(temp_year)
            if instance:
                return instance

        results_dict = self.calculate_stats_for_year(temp_year)
        instance = self.update_or_create_stats_for_year(temp_year, results_dict)

        return instance
