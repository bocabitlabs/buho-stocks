import datetime
import logging

from buho_backend.transaction_types import TransactionType
from companies.utils import CompanyUtils
from dividends_transactions.models import DividendsTransaction
from portfolios.models import Portfolio
from portfolios.utils import PortfolioUtils
from shares_transactions.models import SharesTransaction
from stats.models.portfolio_stats import PortfolioStatsForYear
from stats.utils.company_stats_utils import CompanyStatsUtils
from stock_prices.api import StockPricesApi
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class PortfolioStatsUtils:
    year_for_all = 9999

    def __init__(
        self,
        portfolio_id: int,
        year: int = year_for_all,
        use_portfolio_currency: bool = True,
        update_api_price: bool = False,
    ):
        self.portfolio: Portfolio = Portfolio.objects.get(id=portfolio_id)
        self.year = year
        self.use_portfolio_currency = use_portfolio_currency
        self.update_api_price = update_api_price

    def _get_total_invested_in_rights(self):
        total = 0
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            query = company.rights_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.all()
            else:
                query = query.filter(
                    transaction_date__year=self.year,
                    type=TransactionType.BUY,
                )
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * item.count * exchange_rate) + (
                    item.total_commission.amount * exchange_rate
                )
        return total

    def _get_total_invested_in_shares(self):
        total = 0
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            query = company.shares_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.filter(type=TransactionType.BUY)
            else:
                query = query.filter(transaction_date__year=self.year, type=TransactionType.BUY)
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * exchange_rate * item.count) + (
                    item.total_commission.amount * exchange_rate
                )
        return total

    def _get_accumulated_invested_in_shares_until_year(self):
        total = 0
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            query = company.shares_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.filter(type=TransactionType.BUY)
            else:
                query = query.filter(transaction_date__year__lte=self.year, type=TransactionType.BUY)
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * exchange_rate * item.count) + (
                    item.total_commission.amount * exchange_rate
                )
        return total

    def _get_accumulated_invested_in_rights_until_year(self):
        total = 0
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            query = company.rights_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.filter(type=TransactionType.BUY)
            else:
                query = query.filter(transaction_date__year__lte=self.year, type=TransactionType.BUY)
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * exchange_rate * item.count) + (
                    item.total_commission.amount * exchange_rate
                )
        return total

    def get_dividends(self):
        total = 0
        for company in self.portfolio.companies.all():
            query = company.dividends_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.all()
            else:
                query = query.filter(transaction_date__year=self.year)
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * exchange_rate * item.count) + (
                    item.total_commission.amount * exchange_rate
                )
        return total

    def get_accumulated_dividends_until_year(self):
        total = 0
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            query = company.dividends_transactions
            if self.year == "all" or self.year == self.year_for_all:
                query = query.all()
            else:
                query = query.filter(transaction_date__year__lte=self.year)
            for item in query:
                exchange_rate = 1
                if self.use_portfolio_currency:
                    exchange_rate = item.exchange_rate
                total += (item.gross_price_per_share.amount * exchange_rate * item.count) + (
                    item.total_commission.amount * exchange_rate
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
        logger.debug("Get portfolio value")
        for company in self.portfolio.companies.all():
            if company.is_closed:
                continue

            first_year = CompanyUtils(company.id).get_company_first_year()
            logger.debug(f"{company.name} First year: {first_year} vs {self.year}")
            if self.year != "all" or self.year != self.year_for_all:
                if not first_year or first_year > int(self.year):
                    total += 0
                    continue

            company_stats = CompanyStatsUtils(
                company.id,
                self.year,
                use_portfolio_currency=self.use_portfolio_currency,
            )
            shares_count = company_stats.get_accumulated_shares_count_until_year(self.year)
            api_service = YFinanceApiClient()
            api = StockPricesApi(api_service)
            if self.year == self.year_for_all:
                stock_price = api.get_last_data_from_last_month(company.ticker)
            else:
                stock_price = api.get_last_data_from_year(company.ticker, self.year)
            portfolio_value = company_stats.get_portfolio_value(stock_price, shares_count)
            total += portfolio_value
        return total

    def get_return_with_dividends(self, portfolio_value, accumulated_dividends, total_invested):
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
        temp_year = self.year_for_all if self.year == "all" else self.year

        results = None
        if PortfolioStatsForYear.objects.filter(portfolio=self.portfolio, year=temp_year).exists():
            results = PortfolioStatsForYear.objects.get(portfolio=self.portfolio, year=temp_year)

        if not self.update_api_price and results:
            return results

        results = self.update_stats_for_year()

        return results

    def update_stats_for_year(self):
        temp_year = self.year_for_all if self.year == "all" else self.year

        results = None
        if PortfolioStatsForYear.objects.filter(portfolio=self.portfolio, year=temp_year).exists():
            results = PortfolioStatsForYear.objects.get(portfolio=self.portfolio, year=temp_year)

        data = {
            "invested": 0,
            "dividends": 0,
            "dividends_yield": 0,
            "portfolio_currency": self.portfolio.base_currency,
            "accumulated_investment": 0,
            "accumulated_dividends": 0,
            "portfolio_value": 0,
        }

        for company in self.portfolio.companies.all():
            company_stats = CompanyStatsUtils(company.id, year=self.year, update_api_price=self.update_api_price)
            instance = company_stats.get_stats_for_year()
            data["dividends"] += instance.dividends
            data["accumulated_dividends"] += instance.accumulated_dividends
            if not company.is_closed:
                data["invested"] += instance.invested
                data["accumulated_investment"] += instance.accumulated_investment
                data["portfolio_value"] += instance.portfolio_value

        data["return_value"] = self.get_return(data["portfolio_value"], data["accumulated_investment"])
        data["return_percent"] = self.get_return_percent(data["return_value"], data["accumulated_investment"])
        data["return_with_dividends"] = self.get_return_with_dividends(
            data["portfolio_value"],
            data["accumulated_dividends"],
            data["accumulated_investment"],
        )
        data["return_with_dividends_percent"] = self.get_return_percent(
            data["return_with_dividends"], data["accumulated_investment"]
        )

        if temp_year == self.year_for_all:
            data["dividends_yield"] = self.get_dividends_yield(data["accumulated_dividends"], data["portfolio_value"])
        else:
            data["dividends_yield"] = self.get_dividends_yield(data["dividends"], data["portfolio_value"])

        if results:
            for key in data:
                logger.debug(f"{key}: {data[key]}")
                setattr(results, key, data[key])
            results.save()
        else:
            # Create a new CompanyStatsForYear
            results = PortfolioStatsForYear.objects.create(
                portfolio=self.portfolio,
                year=temp_year,
                **data,
            )
        logger.debug(f"{data['invested']}")

        return results

    def get_stats_for_year_by_company(self):
        results = []
        for company in self.portfolio.companies.all():
            company_stats = CompanyStatsUtils(company.id, year=self.year, update_api_price=self.update_api_price)
            instance = company_stats.get_stats_for_year()
            results.append(instance)

        return results

    def get_portfolio_first_year(self):
        transactions = SharesTransaction.objects.filter(
            company__portfolio=self.portfolio.id,
            company__is_closed=False,
        )
        first_year = transactions.order_by("transaction_date").first()
        if not first_year:
            return None
        return_value = {"year": first_year.transaction_date.year}
        return return_value

    def get_dividends_yield(self, dividends, portfolio_value):
        if portfolio_value != 0:
            return dividends / portfolio_value * 100 if portfolio_value else 0
        return 0

    def get_all_years_stats(self):
        years_result = []
        years_array = []
        first_year = self.get_portfolio_first_year()
        # Get years between year and current year
        if first_year:
            first_year = first_year["year"]
            years_array = range(int(first_year), datetime.datetime.now().year + 1)

        for year in years_array:
            data = {
                "year": year,
                "invested": 0,
                "dividends": 0,
                "portfolioCurrency": self.portfolio.base_currency,
                "accumulatedInvestment": 0,
                "accumulatedDividends": 0,
                "portfolioValue": 0,
                "dividendsYield": 0,
            }

            for company in self.portfolio.companies.all():
                company_stats = CompanyStatsUtils(company.id, year=year)
                instance = company_stats.get_stats_for_year()
                data["invested"] += instance.invested
                data["dividends"] += instance.dividends
                data["accumulatedInvestment"] += instance.accumulated_investment
                data["accumulatedDividends"] += instance.accumulated_dividends
                data["portfolioValue"] += instance.portfolio_value

            data["returnValue"] = self.get_return(data["portfolioValue"], data["accumulatedInvestment"])
            data["returnPercent"] = self.get_return_percent(data["returnValue"], data["accumulatedInvestment"])
            data["return_with_dividends"] = self.get_return_with_dividends(
                data["portfolioValue"],
                data["accumulatedDividends"],
                data["accumulatedInvestment"],
            )
            data["return_with_dividends_percent"] = self.get_return_percent(
                data["return_with_dividends"], data["accumulatedInvestment"]
            )

            if year == self.year_for_all:
                data["dividendsYield"] = self.get_dividends_yield(data["accumulatedDividends"], data["portfolioValue"])
            else:
                data["dividendsYield"] = self.get_dividends_yield(data["dividends"], data["portfolioValue"])

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
        portolio_utils = PortfolioUtils()
        first_year = portolio_utils.get_portfolio_first_year(self.portfolio)
        if first_year is None:
            return {}
        # Iterate all years until today
        for year in range(first_year, datetime.datetime.now().year + 1):
            years[year] = self.get_dividends_for_year_monthly(year)
        return years
