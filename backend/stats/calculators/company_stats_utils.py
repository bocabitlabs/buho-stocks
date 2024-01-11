import datetime
import logging

from django.conf import settings

from companies.data_calculators import CompanyDataCalculator
from companies.models import Company
from stats.models.company_stats import CompanyStatsForYear
from stock_prices.fetchers import CompanyStockPriceFetcher

logger = logging.getLogger("buho_backend")


class CompanyStatsCalculator:
    def __init__(
        self,
        company_id: int,
        year=settings.YEAR_FOR_ALL,
        use_portfolio_currency: bool = True,
        update_api_price: bool = False,
    ):
        self.year = year
        self.use_portfolio_currency = use_portfolio_currency
        self.update_api_price = update_api_price

        self.company = Company.objects.get(id=company_id)
        self.company_data_calculator = CompanyDataCalculator(
            self.company.id, use_portfolio_currency=self.use_portfolio_currency
        )

    def get_year_stats(self, year: int):
        result = None
        if CompanyStatsForYear.objects.filter(company=self.company, year=year).exists():
            result = CompanyStatsForYear.objects.get(company=self.company, year=year)
        return result

    def calculate_stats_for_year(self, year: int):
        accum_shares_count = self.company_data_calculator.calculate_accumulated_shares_count_until_year(year)
        total_invested = self.company_data_calculator.calculate_total_invested_on_year(year)
        dividends = self.company_data_calculator.dividends_calculator.calculate_dividends_of_year(year)
        accumulated_investment = self.company_data_calculator.calculate_accumulated_investment_until_year(year)
        accumulated_dividends = (
            self.company_data_calculator.dividends_calculator.calculate_accumulated_dividends_until_year(year)
        )

        current_year = year
        if year == settings.YEAR_FOR_ALL:
            # Current year
            current_year = datetime.date.today().year

        company_stock_prices_fetcher = CompanyStockPriceFetcher(
            self.company, current_year, update_api_price=self.update_api_price
        )
        last_stock_price = company_stock_prices_fetcher.get_year_last_stock_price()

        # Calculated values
        portfolio_value = self.company_data_calculator.calculate_company_value_on_year(year)
        return_value = self.company_data_calculator.calculate_return_on_year(year)
        return_percent = self.company_data_calculator.calculate_return_yield_on_year(year)
        return_with_dividends = self.company_data_calculator.calculate_return_with_dividends_on_year(year)
        return_with_dividends_yield = self.company_data_calculator.calculate_return_yield_with_dividends_on_year(year)
        dividends_yield = self.company_data_calculator.calculate_dividends_yield_on_year(year)
        # Fixes
        last_stock_price_value = last_stock_price.price.amount if last_stock_price else 0
        last_stock_price_currency = self.company.base_currency
        last_stock_price_transaction_date = last_stock_price.transaction_date if last_stock_price else f"{year}-01-01"
        portfolio_currency = self.company.portfolio.base_currency
        portfolio_is_down = portfolio_value < accumulated_investment

        results_dict = {
            "accumulated_dividends": accumulated_dividends,
            "accumulated_investment": accumulated_investment,
            "dividends": dividends,
            "dividends_yield": dividends_yield,
            "invested": total_invested,
            "portfolio_currency": portfolio_currency,
            "portfolio_value": portfolio_value,
            "portfolio_value_is_down": portfolio_is_down,
            "return_value": return_value,
            "return_percent": return_percent,
            "return_with_dividends": return_with_dividends,
            "return_with_dividends_percent": return_with_dividends_yield,
            "shares_count": accum_shares_count,
            "stock_price_value": last_stock_price_value,
            "stock_price_currency": last_stock_price_currency,
            "stock_price_transaction_date": last_stock_price_transaction_date,
        }
        return results_dict

    def update_year_stats(self):
        year_stats = self.get_year_stats(self.year)

        calculated_data = self.calculate_stats_for_year(self.year)

        if year_stats:
            for key in calculated_data:
                setattr(year_stats, key, calculated_data[key])
                logger.debug(f"Year: {self.year} Setting {key} to {calculated_data[key]}")
            logger.debug(f"Year: {self.year} Saving year stats. {year_stats}")
            year_stats.save()
        else:
            # Create a new CompanyStatsForYear
            year_stats = CompanyStatsForYear.objects.create(
                company=self.company,
                year=self.year,
                **calculated_data,
            )

        return year_stats
