from decimal import Decimal
import logging
from django.contrib.auth.models import User
from forex_python.converter import RatesNotAvailableError
from django.utils import timezone
from buho_backend.transaction_types import TransactionType
from companies.models import Company
from exchange_rates.models import ExchangeRate
from exchange_rates.utils import get_exchange_rates_from_api
from stats.models.company_stats import CompanyStatsForYear
from stock_prices.api import StockPricesApi
from stock_prices.services.custom_yfinance_service import CustomYFinanceService


logger = logging.getLogger("buho_backend")


class CompanyUtils:
    def get_company_first_year(self, company_id, user_id):
        query = SharesTransaction.objects.filter(
            company_id=company_id, user=user_id
        ).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None

class CompanyStatsUtils:
    def __init__(
        self, company_id, user_id, year="all", use_currency="portfolio", force=False
    ):
        self.company = Company.objects.get(id=company_id, user=user_id)
        self.year = year
        self.use_currency = use_currency
        self.user_id = user_id
        self.force = force

    def get_shares_count(self):
        total = 0
        query = self.company.shares_transactions
        if self.year == "all":
            query = query.all()
        else:
            query = query.filter(transaction_date__year__lte=self.year)
        for item in query:
            total += item.count
        return total

    def _get_total_invested_in_rights(self):
        total = 0
        query = self.company.rights_transactions
        if self.year == "all":
            query = query.all()
        else:
            query = query.filter(
                transaction_date__year=self.year, type=TransactionType.BUY
            )
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            total += (
                item.gross_price_per_share.amount * item.count * exchange_rate
                + item.total_commission.amount * exchange_rate
            )
        return total

    def _get_total_invested_in_shares(self):
        total = 0
        query = self.company.shares_transactions
        if self.year == "all":
            query = query.filter(type=TransactionType.BUY)
        else:
            query = query.filter(
                transaction_date__year=self.year, type=TransactionType.BUY
            )
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            total += (
                item.gross_price_per_share.amount * exchange_rate * item.count
                + item.total_commission.amount * exchange_rate
            )
        return total

    def _get_accumulated_invested_in_shares_until_year(self):
        total = 0
        query = self.company.shares_transactions
        if self.year == "all":
            query = query.filter(type=TransactionType.BUY)
        else:
            query = query.filter(
                transaction_date__year__lte=self.year, type=TransactionType.BUY
            )
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            total += (
                item.gross_price_per_share.amount * exchange_rate * item.count
                + item.total_commission.amount * exchange_rate
            )
        return total

    def _get_accumulated_invested_in_rights_until_year(self):
        total = 0
        query = self.company.rights_transactions
        if self.year == "all":
            query = query.filter(type=TransactionType.BUY)
        else:
            query = query.filter(
                transaction_date__year__lte=self.year, type=TransactionType.BUY
            )
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            total += (
                item.gross_price_per_share.amount * exchange_rate * item.count
                - item.total_commission.amount * exchange_rate
            )
        return total

    def get_dividends(self):
        total = 0
        query = self.company.dividends_transactions
        if self.year == "all":
            query = query.all()
        else:
            query = query.filter(transaction_date__year=self.year)
        print(f"Found {query.count()} dividends")
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            print(
                f"{item.gross_price_per_share.amount} * {exchange_rate} * {item.count}"
            )
            total += (
                item.gross_price_per_share.amount * exchange_rate * item.count
                - item.total_commission.amount * exchange_rate
            )
            print(f"Total: {total}")
        return total

    def get_accumulated_dividends_until_year(self):
        total = 0
        query = self.company.dividends_transactions
        if self.year == "all":
            query = query.all()
        else:
            query = query.filter(transaction_date__year__lte=self.year)
        for item in query:
            exchange_rate = 1
            if self.use_currency == "portfolio":
                exchange_rate = item.exchange_rate
            total += (
                item.gross_price_per_share.amount * exchange_rate * item.count
                - item.total_commission.amount * exchange_rate
            )
        return total

    def get_total_invested(self):
        total = 0
        total += self._get_total_invested_in_shares()
        total += self._get_total_invested_in_rights()
        return total

    def get_accumulated_investment_until_year(self):
        total = 0
        total += self._get_accumulated_invested_in_shares_until_year()
        total += self._get_accumulated_invested_in_rights_until_year()
        return total

    def _get_exchange_rate_for_stock_price(self, stock_price):
        exchange_rate_value = 1
        if self.use_currency == "portfolio":
            if self.company.base_currency != self.company.portfolio.base_currency:
                try:
                    exchange_rate = ExchangeRate.objects.get(
                        exchange_from=self.company.base_currency,
                        exchange_to=self.company.portfolio.base_currency,
                        exchange_date=stock_price["transaction_date"],
                    )
                    exchange_rate_value = exchange_rate.exchange_rate
                except ExchangeRate.DoesNotExist:
                    try:
                        exchange_rate = get_exchange_rates_from_api(
                            self.company.base_currency,
                            self.company.portfolio.base_currency,
                            stock_price["transaction_date"],
                        )
                        exchange_rate_value = exchange_rate["exchange_rate"].value
                    except RatesNotAvailableError as error:
                        print(str(error))
        return exchange_rate_value

    def get_portfolio_value(self, stock_price, shares_count):
        logger.debug(
            f"Calculating portfolio value for {self.company.name} - shares: {shares_count} - stock price: {stock_price}"
        )
        if shares_count == 0 or not stock_price:
            price = 0
            exchange_rate_value = 0
        else:
            price = stock_price["price"]
            exchange_rate_value = self._get_exchange_rate_for_stock_price(stock_price)
        return Decimal(price) * shares_count * Decimal(exchange_rate_value)

    def _get_stock_price(self):
        api_service = CustomYFinanceService()
        api = StockPricesApi(api_service)
        if self.year == "all":
            stock_price = api.get_last_data_from_last_month(self.company.ticker)
        else:
            first_year = CompanyUtils().get_company_first_year(
                self.company.id, self.company.user
            )
            logger.debug(
                f"Getting stock price for {self.company.name}. Year: {self.year}. First year: {first_year}"
            )
            if not first_year or first_year > int(self.year):
                return None
            stock_price = api.get_last_data_from_year(self.company.ticker, self.year)
            logger.debug(f"Stock price: {stock_price}")
        return stock_price

    def get_return_with_dividends(
        self, portfolio_value, accumulated_dividends, total_invested
    ):
        if portfolio_value:
            return portfolio_value - total_invested + accumulated_dividends
        return 0

    def get_return(self, portfolio_value, total_invested):
        if portfolio_value:
            return portfolio_value - total_invested
        return 0

    def get_return_percent(self, total_return, total_invested):
        if total_invested != 0:
            return total_return / total_invested * 100
        return 0

    def get_dividends_yield(self, dividends, portfolio_value):
        if portfolio_value != 0:
            return dividends / portfolio_value * 100 if portfolio_value else 0
        return 0

    def get_stats_for_year(self):

        year_for_all = 9999
        temp_year = year_for_all if self.year == "all" else self.year

        if not self.force:
            if CompanyStatsForYear.objects.filter(
                company=self.company, year=temp_year
            ).exists():
                company_stats_for_year = CompanyStatsForYear.objects.get(
                    company=self.company, year=temp_year
                )
                if (
                    company_stats_for_year.date_created
                    > timezone.now() - timezone.timedelta(days=30)
                ):
                    return company_stats_for_year

        shares_count = self.get_shares_count()
        total_invested = self.get_total_invested()
        dividends = self.get_dividends()
        accumulated_investment = self.get_accumulated_investment_until_year()
        accumulated_dividends = self.get_accumulated_dividends_until_year()
        stock_price = self._get_stock_price()
        portfolio_value = self.get_portfolio_value(stock_price, shares_count)
        return_value = self.get_return(portfolio_value, accumulated_investment)
        return_percent = self.get_return_percent(return_value, accumulated_investment)
        return_with_dividends = self.get_return_with_dividends(
            portfolio_value, accumulated_dividends, accumulated_investment
        )
        return_with_dividends_percent = self.get_return_percent(
            return_with_dividends, accumulated_investment
        )
        dividends_yield = self.get_dividends_yield(dividends, portfolio_value)

        results = {
            "shares_count": shares_count,
            "invested": total_invested,
            "dividends": dividends,
            "portfolio_currency": self.company.portfolio.base_currency,
            "accumulated_investment": accumulated_investment,
            "accumulated_dividends": accumulated_dividends,
            "stock_price_value": stock_price["price"] if stock_price else 0,
            "stock_price_currency": stock_price["price_currency"]
            if stock_price
            else "",
            "stock_price_transaction_date": stock_price["transaction_date"]
            if stock_price
            else f"{self.year}-01-01",
            "portfolio_value": portfolio_value,
            "portfolio_value_is_down": portfolio_value < accumulated_investment,
            "return_value": return_value,
            "dividends_yield": dividends_yield,
            "return_percent": return_percent,
            "return_with_dividends": return_with_dividends,
            "return_with_dividends_percent": return_with_dividends_percent,
        }
        logger.debug(results)
        # Delete the old CompanyStatsForYear if it was created more than 1 month ago
        if CompanyStatsForYear.objects.filter(
            company=self.company, year=temp_year
        ).exists():
            company_stats_for_year = CompanyStatsForYear.objects.get(
                company=self.company, year=temp_year
            )
            company_stats_for_year.delete()
            # Create a new CompanyStatsForYear
        results = CompanyStatsForYear.objects.create(
            user=User.objects.get(id=self.user_id),
            company=self.company,
            year=temp_year,
            **results,
        )
        logger.debug(results)

        return results
