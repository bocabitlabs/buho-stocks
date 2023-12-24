from decimal import Decimal

from buho_backend.settings.common import YEAR_FOR_ALL
from companies.models import Company
from dividends_transactions.utils import DividendsTransactionCalculator
from exchange_rates.services.exchange_rate_fetcher import ExchangeRateFetcher
from rights_transactions.calculators import RightsTransactionCalculator
from shares_transactions.calculators.shares_transaction_calculator import SharesTransactionCalculator
from shares_transactions.models import SharesTransaction
from stock_prices.api import StockPricesApi
from stock_prices.services.yfinance_api_client import YFinanceApiClient


class CompanyDataCalculator:
    def __init__(self, company_id: int, use_portfolio_currency: bool = True):
        self.company = Company.objects.get(id=company_id)
        self.use_portfolio_currency: bool = use_portfolio_currency

        self.shares_calculator = SharesTransactionCalculator(
            self.company.shares_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )
        self.rights_calculator = RightsTransactionCalculator(
            self.company.rights_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )

        self.dividends_calculator = DividendsTransactionCalculator(
            self.company.dividends_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )

    def get_company_first_year(self) -> int | None:
        query = SharesTransaction.objects.filter(company_id=self.company.id).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None

    def calculate_total_invested_on_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        total += self.shares_calculator.calculate_invested_on_year(year)
        total += self.rights_calculator.calculate_invested_on_year(year)
        return total

    def calculate_accumulated_investment_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        total += self.shares_calculator.calculate_accumulated_investment_until_year(year)
        total += self.rights_calculator.calculate_accumulated_investment_until_year(year)
        return total

    def calculate_accumulated_shares_count_until_year(self, year: int) -> int:
        count = self.shares_calculator.calculate_shares_count_until_year(year)
        return count

    def calculate_dividends_of_year(self, year: int) -> Decimal:
        dividends = self.dividends_calculator.calculate_dividends_of_year(year)
        return dividends

    def calculate_accumulated_dividends_until_year(self, year: int) -> Decimal:
        accumulated_dividends = self.dividends_calculator.calculate_accumulated_dividends_until_year(year)
        return accumulated_dividends

    def calculate_accumulated_return_from_sales_until_year(self, year: int) -> Decimal:
        accumulated_sales_return = self.shares_calculator.calculate_accumulated_return_from_sales_until_year(year)
        return accumulated_sales_return

    def calculate_company_value_on_year(self, year: int) -> Decimal:
        total = 0
        shares_count = self.calculate_accumulated_shares_count_until_year(year)
        if shares_count > 0:
            api_service = YFinanceApiClient()
            stock_api = StockPricesApi(api_service)
            if year == YEAR_FOR_ALL:
                stock_price = stock_api.get_last_data_from_last_month(self.company.ticker)
            else:
                stock_price = stock_api.get_last_data_from_year(self.company.ticker, year)
            if stock_price:
                price = stock_price["price"]
                transaction_date = stock_price["transaction_date"]

                exchange_rates_fetcher = ExchangeRateFetcher()

                exchange_rate = exchange_rates_fetcher.get_exchange_rate_for_date(
                    self.company.base_currency,
                    self.company.portfolio.base_currency,
                    transaction_date,
                )
                if exchange_rate:
                    total = Decimal(price) * shares_count * Decimal(exchange_rate.exchange_rate)
        return total

    def calculate_return_with_dividends_on_year(self, year: int) -> Decimal:
        company_value = self.calculate_company_value_on_year(year)
        accumulated_dividends = self.calculate_accumulated_dividends_until_year(year)
        total_invested = self.calculate_accumulated_investment_until_year(year)

        return company_value - total_invested + accumulated_dividends

    def calculate_return_on_year(self, year: int) -> Decimal:
        company_value = self.calculate_company_value_on_year(year)
        total_invested = self.calculate_accumulated_investment_until_year(year)

        return company_value - total_invested

    def calculate_return_yield_on_year(self, year: int) -> Decimal:
        return_value = self.calculate_return_on_year(year)
        total_invested = self.calculate_accumulated_investment_until_year(year)

        if total_invested != 0:
            return (return_value / total_invested) * 100
        return 0

    def calculate_return_yield_with_dividends_on_year(self, year: int) -> Decimal:
        return_with_dividends = self.calculate_return_with_dividends_on_year(year)
        total_invested = self.calculate_accumulated_investment_until_year(year)

        if total_invested != 0:
            return (return_with_dividends / total_invested) * 100
        return 0

    def calculate_dividends_yield_on_year(self, year: int) -> Decimal:
        total = 0
        dividends = self.dividends_calculator.calculate_dividends_of_year(year)
        company_value = self.calculate_company_value_on_year(year)

        if company_value != 0:
            total = (dividends / company_value) * 100 if company_value else 0
        return total

    def calculate_accummulated_dividends_yield(self, year: int) -> Decimal:
        total = 0
        dividends = self.dividends_calculator.calculate_accumulated_dividends_until_year(year)
        company_value = self.calculate_company_value_on_year(year)

        if company_value != 0:
            total = (dividends / company_value) * 100 if company_value else 0
        return total
