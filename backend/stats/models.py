from decimal import Decimal

from forex_python.converter import RatesNotAvailableError
from buho_backend.transaction_types import TransactionType
from companies.models import Company
from exchange_rates.models import ExchangeRate
from exchange_rates.utils import get_exchange_rates_from_api
from stock_prices.api import StockPricesApi
from stock_prices.services.yfinance_service import YFinanceStockPricesService
from portfolios.models import Portfolio

# Create your models here.
class CompanyStats:
    def __init__(self, company_id, user_id, year="all", use_currency="portfolio"):
        self.company = Company.objects.get(id=company_id, user=user_id)
        self.year = year
        self.use_currency = use_currency

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
            print(f"{item.gross_price_per_share.amount} * {exchange_rate} * {item.count}")
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
                + item.total_commission.amount * exchange_rate
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

    def get_portfolio_value(self, stock_price, shares_count):
        if stock_price:
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
                        except RatesNotAvailableError as e:
                            print(str(e))
            print(f"stock_price: {stock_price['price']} - E.R: {exchange_rate_value}")
            return Decimal(stock_price["price"]) * shares_count * Decimal(exchange_rate_value)
        return 0

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

    def get_stats_for_year(self):
        shares_count = self.get_shares_count()
        total_invested = self.get_total_invested()
        dividends = self.get_dividends()
        accumulated_investment = self.get_accumulated_investment_until_year()
        accumulated_dividends = self.get_accumulated_dividends_until_year()
        yfinance = YFinanceStockPricesService()
        api = StockPricesApi(yfinance)
        if self.year == "all":
            stock_price = api.get_last_data_from_last_month(self.company.ticker)
        else:
            stock_price = api.get_last_data_from_year(self.company.ticker, self.year)
        portfolio_value = self.get_portfolio_value(stock_price, shares_count)
        return_value = self.get_return(portfolio_value, accumulated_investment)
        return_percent = self.get_return_percent(return_value, accumulated_investment)
        return_with_dividends = self.get_return_with_dividends(
            portfolio_value, accumulated_dividends, accumulated_investment
        )
        return_with_dividends_percent = self.get_return_percent(
            return_with_dividends, accumulated_investment
        )
        return {
            "sharesCount": shares_count,
            "invested": total_invested,
            "dividends": dividends,
            "portfolioCurrency": self.company.portfolio.base_currency,
            "accumulatedInvestment": accumulated_investment,
            "accumulatedDividends": accumulated_dividends,
            "stockPrice": stock_price,
            "portfolioValue": portfolio_value,
            "portfolioValueIsDown": portfolio_value < accumulated_investment,
            "returnValue": return_value,
            "returnPercent": return_percent,
            "returnWithDividends": return_with_dividends,
            "returnWithDividendsPercent": return_with_dividends_percent,
        }


class PortfolioStats:
    def __init__(self, portfolio_id, user_id, year="all", use_currency="portfolio"):
        self.portfolio = Portfolio.objects.get(id=portfolio_id, user=user_id)
        self.year = year
        self.use_currency = use_currency
        self.user_id = user_id

    def _get_total_invested_in_rights(self):
        total = 0
        for company in self.portfolio.companies.all():
            query = company.rights_transactions
            if self.year == "all":
                query = query.all()
            else:
                query = query.filter(
                    transaction_date__year=self.year,
                    type=TransactionType.BUY,
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
        for company in self.portfolio.companies.all():
            query = company.shares_transactions
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
        for company in self.portfolio.companies.all():
            query = company.shares_transactions
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
        for company in self.portfolio.companies.all():
            query = company.rights_transactions
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

    def get_dividends(self):
        total = 0
        for company in self.portfolio.companies.all():
            query = company.dividends_transactions
            if self.year == "all":
                query = query.all()
            else:
                query = query.filter(transaction_date__year=self.year)
            for item in query:
                exchange_rate = 1
                if self.use_currency == "portfolio":
                    exchange_rate = item.exchange_rate
                total += (
                    item.gross_price_per_share.amount * exchange_rate * item.count
                    + item.total_commission.amount * exchange_rate
                )
        return total

    def get_accumulated_dividends_until_year(self):
        total = 0
        for company in self.portfolio.companies.all():
            query = company.dividends_transactions
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
                    + item.total_commission.amount * exchange_rate
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

    def get_portfolio_value(self):
        total = 0
        for company in self.portfolio.companies.all():
            company_stats = CompanyStats(
                company.id, self.user_id, self.year, use_currency=self.use_currency
            )
            shares_count = company_stats.get_shares_count()
            yfinance = YFinanceStockPricesService()
            api = StockPricesApi(yfinance)
            if self.year == "all":
                stock_price = api.get_last_data_from_last_month(company.ticker)
            else:
                stock_price = api.get_last_data_from_year(company.ticker, self.year)
            portfolio_value = company_stats.get_portfolio_value(
                stock_price, shares_count
            )
            total += portfolio_value
        return total

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

    def get_stats_for_year(self):
        total_invested = self.get_total_invested()
        dividends = self.get_dividends()
        accumulated_investment = self.get_accumulated_investment_until_year()
        accumulated_dividends = self.get_accumulated_dividends_until_year()
        portfolio_value = self.get_portfolio_value()
        return_value = self.get_return(portfolio_value, accumulated_investment)
        return_percent = self.get_return_percent(return_value, accumulated_investment)
        return_with_dividends = self.get_return_with_dividends(
            portfolio_value, accumulated_dividends, accumulated_investment
        )
        return_with_dividends_percent = self.get_return_percent(
            return_with_dividends, accumulated_investment
        )
        return {
            "invested": total_invested,
            "dividends": dividends,
            "portfolioCurrency": self.portfolio.base_currency,
            "accumulatedInvestment": accumulated_investment,
            "accumulatedDividends": accumulated_dividends,
            "portfolioValue": portfolio_value,
            "portfolioValueIsDown": portfolio_value < accumulated_investment,
            "returnValue": return_value,
            "returnPercent": return_percent,
            "returnWithDividends": return_with_dividends,
            "returnWithDividendsPercent": return_with_dividends_percent,
        }
