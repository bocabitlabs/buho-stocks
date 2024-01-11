from decimal import Decimal

from companies.data_calculators import CompanyDataCalculator
from portfolios.models import Portfolio
from shares_transactions.models import SharesTransaction


class PortfolioDataCalculator:
    def __init__(self, portfolio_id: int, use_portfolio_currency: bool = True):
        self.portfolio = Portfolio.objects.get(id=portfolio_id)
        self.use_portfolio_currency: bool = use_portfolio_currency

    def get_portfolio_first_year(self) -> int | None:
        query = SharesTransaction.objects.filter(
            company__portfolio=self.portfolio.id, company__is_closed=False
        ).order_by("transaction_date")
        if query.exists():
            transaction = query[0]
            year: int = transaction.transaction_date.year
            return year
        return None

    def calculate_total_invested_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_total_invested_on_year(year)
        return total

    def calculate_accumulated_investment_until_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_accumulated_investment_until_year(year)
        return total

    def calculate_total_dividends_of_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_dividends_of_year(year)

        return total

    def calculate_accumulated_dividends_until_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_accumulated_dividends_until_year(year)
        return total

    def calculate_portfolio_value_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_company_value_on_year(year)

        return total

    def calculate_return_with_dividends_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_return_with_dividends_on_year(year)
        return total

    def calculate_return_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            data_calculator = CompanyDataCalculator(company.id, use_portfolio_currency=self.use_portfolio_currency)
            total += data_calculator.calculate_return_on_year(year)
        return total

    def calculate_return_yield_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        return_on_year = self.calculate_return_on_year(year)
        accumulated_investment = self.calculate_accumulated_investment_until_year(year)
        if accumulated_investment == 0:
            return total

        total = (return_on_year / accumulated_investment) * 100
        return total

    def calculate_return_with_dividends_yield_on_year(self, year: int) -> Decimal:
        total = Decimal(0)
        return_with_dividends_on_year = self.calculate_return_with_dividends_on_year(year)
        accumulated_investment = self.calculate_accumulated_investment_until_year(year)
        if accumulated_investment == 0:
            return total

        total = (return_with_dividends_on_year / accumulated_investment) * 100
        return total

    def calculate_accummulated_dividends_yield(self, year: int) -> Decimal:
        total = Decimal(0)
        accummulated_dividends = self.calculate_accumulated_dividends_until_year(year)
        portfolio_value = self.calculate_portfolio_value_on_year(year)
        if portfolio_value == 0:
            return total
        total = (accummulated_dividends / portfolio_value) * 100
        return total
