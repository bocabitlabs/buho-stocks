from datetime import date
from decimal import Decimal

from django.conf import settings
from django.db.models.query import QuerySet

from buho_backend.transaction_types import TransactionType
from rights_transactions.models import RightsTransaction
from shares_transactions.calculators.transaction_calculator import TransactionCalculator


class RightsTransactionCalculator:
    def __init__(
        self,
        rights_transactions: QuerySet[RightsTransaction],
        use_portfolio_currency: bool = True,
    ):
        self.rights_transactions = rights_transactions
        self.use_portfolio_currency = use_portfolio_currency

    def _get_multiple_sell_transactions_query(
        self,
        year: int,
        use_accumulated: bool = False,
    ):
        """[summary]

        Args:
            filter (str, optional): accumulated to obtain the accumulated values.
            Otherwhise will get the values for a give year or all Defaults to None.

        Returns:
            [type]: [description]
        """
        query = self.rights_transactions
        query = query.filter(type=TransactionType.SELL)

        if year == settings.YEAR_FOR_ALL:
            return query

        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

    def _get_multiple_buy_transactions_query(
        self,
        year: int,
        use_accumulated: bool = False,
    ) -> QuerySet[RightsTransaction]:
        query: QuerySet[RightsTransaction] = self.rights_transactions

        query = query.filter(type=TransactionType.BUY)

        if year == settings.YEAR_FOR_ALL:
            return query

        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

    def calculate_invested_on_year(self, year: int) -> Decimal:
        """Get the total amount invested on a given year

        Returns:
            Decimal: Total amount invested on rights
        """
        total: Decimal = Decimal(0)
        query = self._get_multiple_buy_transactions_query(year)

        transactions_calculator = TransactionCalculator()
        total = transactions_calculator.calculate_investments(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        return total

    def calculate_accumulated_investment_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        # BUY
        query = self._get_multiple_buy_transactions_query(year, use_accumulated=True)
        transactions_calculator = TransactionCalculator()
        buy_total = transactions_calculator.calculate_investments(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        # SELL
        query = self._get_multiple_sell_transactions_query(year, use_accumulated=True)
        transactions_calculator = TransactionCalculator()
        sell_total = transactions_calculator.calculate_investments(
            query, use_portfolio_currency=self.use_portfolio_currency
        )

        total = buy_total - sell_total

        return total

    def get_accumulated_investment_until_current_year(self) -> Decimal:
        year = date.today().year
        total = self.calculate_accumulated_investment_until_year(year)
        return total

    def calculate_accumulated_return_from_sales_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        if year == settings.YEAR_FOR_ALL:
            year = date.today().year
        query = self._get_multiple_sell_transactions_query(year, use_accumulated=True)
        transactions_calculator = TransactionCalculator()
        total = transactions_calculator.calculate_transactions_amount(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        return total
