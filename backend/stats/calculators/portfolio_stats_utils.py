import datetime
import logging

from buho_backend.settings.common import YEAR_FOR_ALL
from dividends_transactions.models import DividendsTransaction
from portfolios.calculators import get_portfolio_first_year
from portfolios.data_calculators import PortfolioDataCalculator
from portfolios.models import Portfolio
from stats.calculators.company_stats_utils import CompanyStatsCalculator
from stats.models.portfolio_stats import PortfolioStatsForYear

logger = logging.getLogger("buho_backend")


class PortfolioStatsUtils:
    def __init__(
        self,
        portfolio_id: int,
        year: int = YEAR_FOR_ALL,
        use_portfolio_currency: bool = True,
        update_api_price: bool = False,
    ):
        self.portfolio: Portfolio = Portfolio.objects.get(id=portfolio_id)
        self.portfolio_data_calculator = PortfolioDataCalculator(
            portfolio_id, use_portfolio_currency=use_portfolio_currency
        )

        self.year = year
        self.use_portfolio_currency = use_portfolio_currency
        self.update_api_price = update_api_price

    def get_year_stats(self):
        results = None
        if PortfolioStatsForYear.objects.filter(portfolio=self.portfolio, year=self.year).exists():
            results = PortfolioStatsForYear.objects.get(portfolio=self.portfolio, year=self.year)

            return results
        return None

    def update_year_stats(self):
        results = self.get_year_stats()

        invested_on_year = self.portfolio_data_calculator.calculate_total_invested_on_year(self.year)
        accummulated_invetment = self.portfolio_data_calculator.calculate_accumulated_investment_until_year(self.year)
        year_dividends = self.portfolio_data_calculator.calculate_total_dividends_of_year(self.year)
        accummulated_dividends = self.portfolio_data_calculator.calculate_accumulated_dividends_until_year(self.year)
        portfolio_value = self.portfolio_data_calculator.calculate_portfolio_value_on_year(self.year)
        return_value = self.portfolio_data_calculator.calculate_return_on_year(self.year)
        return_yield = self.portfolio_data_calculator.calculate_return_yield_on_year(self.year)
        return_with_dividends = self.portfolio_data_calculator.calculate_return_with_dividends_on_year(self.year)
        return_with_dividends_yield = self.portfolio_data_calculator.calculate_return_with_dividends_yield_on_year(
            self.year
        )
        dividends_yield = self.portfolio_data_calculator.calculate_accummulated_dividends_yield(self.year)

        data = {
            "accumulated_dividends": accummulated_dividends,
            "accumulated_investment": accummulated_invetment,
            "dividends": year_dividends,
            "dividends_yield": dividends_yield,
            "invested": invested_on_year,
            "portfolio_currency": self.portfolio.base_currency,
            "portfolio_value": portfolio_value,
            "return_percent": return_yield,
            "return_value": return_value,
            "return_with_dividends": return_with_dividends,
            "return_with_dividends_percent": return_with_dividends_yield,
        }

        if results:
            for key in data:
                setattr(results, key, data[key])
            results.save()
        else:
            # Create a new CompanyStatsForYear
            results = PortfolioStatsForYear.objects.create(
                portfolio=self.portfolio,
                year=self.year,
                **data,
            )
        return results

    def get_year_stats_by_company(self):
        results = []
        for company in self.portfolio.companies.all():
            company_stats = CompanyStatsCalculator(company.id, year=self.year, update_api_price=self.update_api_price)
            instance = company_stats.get_year_stats()
            results.append(instance)

        return results

    def get_all_years_stats(self):
        years_result = []
        years_array = []
        first_year = get_portfolio_first_year(self.portfolio.id)
        if first_year:
            first_year = {"year": first_year}

        # Get years between year and current year
        if first_year:
            first_year = first_year["year"]
            years_array = range(int(first_year), datetime.datetime.now().year + 1)

        for year in years_array:
            invested_on_year = self.portfolio_data_calculator.calculate_total_invested_on_year(year)
            accummulated_invetment = self.portfolio_data_calculator.calculate_accumulated_investment_until_year(year)
            year_dividends = self.portfolio_data_calculator.calculate_total_dividends_of_year(year)
            accummulated_dividends = self.portfolio_data_calculator.calculate_accumulated_dividends_until_year(year)
            portfolio_value = self.portfolio_data_calculator.calculate_portfolio_value_on_year(year)
            return_value = self.portfolio_data_calculator.calculate_return_on_year(year)
            return_yield = self.portfolio_data_calculator.calculate_return_yield_on_year(year)
            return_with_dividends = self.portfolio_data_calculator.calculate_return_with_dividends_on_year(year)
            return_with_dividends_yield = self.portfolio_data_calculator.calculate_return_with_dividends_yield_on_year(
                year
            )
            dividends_yield = self.portfolio_data_calculator.calculate_accummulated_dividends_yield(year)
            data = {
                "year": year,
                "invested": invested_on_year,
                "dividends": year_dividends,
                "portfolioCurrency": self.portfolio.base_currency,
                "accumulatedInvestment": accummulated_invetment,
                "accumulatedDividends": accummulated_dividends,
                "portfolioValue": portfolio_value,
                "dividendsYield": dividends_yield,
                "returnValue": return_value,
                "returnPercent": return_yield,
                "return_with_dividends": return_with_dividends,
                "return_with_dividends_percent": return_with_dividends_yield,
            }

            years_result.append(data)

        return years_result

    def get_dividends_for_year_monthly(self, year=None):
        logger.debug(f"Get dividends for year {year}")
        if year is None:
            year = self.year
        transactions = DividendsTransaction.objects.filter(
            company__portfolio=self.portfolio, transaction_date__year=year
        ).order_by("transaction_date")

        result = {}

        def get_transaction_value(transaction):
            current_value = (transaction.total_amount.amount * transaction.exchange_rate) - (
                transaction.total_commission.amount * transaction.exchange_rate
            )
            return current_value

        for transaction in transactions:
            month = str(transaction.transaction_date.strftime("%B"))
            if month in result:
                current_value = get_transaction_value(transaction)
                result[month] = result[month] + current_value
            else:
                current_value = get_transaction_value(transaction)
                result[month] = current_value
        logger.debug(result)

        return result

    def get_dividends_for_all_years_monthly(self):
        logger.debug("Get dividends for all years monthly")
        years = {}
        first_year = get_portfolio_first_year(self.portfolio)
        if first_year is None:
            return {}
        # Iterate all years until today
        for year in range(first_year, datetime.datetime.now().year + 1):
            years[year] = self.get_dividends_for_year_monthly(year)
        return years
