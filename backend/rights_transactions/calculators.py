from datetime import date
from decimal import Decimal

from django.db.models.query import QuerySet

from buho_backend.transaction_types import TransactionType
from rights_transactions.models import RightsTransaction
from shares_transactions.new_utils.transaction_utils import TransactionCalculator


class RightsTransactionCalculator:
    def __init__(self, transactions: QuerySet[RightsTransaction], use_portfolio_currency: bool = True):
        self.transactions = transactions
        self.use_portfolio_currency = use_portfolio_currency

    def _get_transactions_query(self, year: int, use_accumulated: bool = False, only_buy: bool = True):
        """[summary]

        Args:
            filter (str, optional): accumulated to obtain the accumulated values.
            Otherwhise will get the values for a give year or all Defaults to None.

        Returns:
            [type]: [description]
        """
        query = self.transactions

        if only_buy:
            query = query.filter(type=TransactionType.BUY)

        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

    def get_invested_on_year(self, year: int) -> Decimal:
        """Get the total amount invested on a given year

        Returns:
            Decimal: Total amount invested on rights
        """
        total: Decimal = Decimal(0)
        query = self._get_transactions_query(year)
        transactions_utils = TransactionCalculator()
        total = transactions_utils.get_transactions_amount(query, use_portfolio_currency=self.use_portfolio_currency)
        return total

    def get_accumulated_investment_until_year(self, year: int) -> Decimal:
        """Get the total amount invested until a given year (included)

        Returns:
            [type]: [description]
        """
        total: Decimal = Decimal(0)
        query = self._get_transactions_query(year, use_accumulated=True)
        transactions_utils = TransactionCalculator()

        total = transactions_utils.get_transactions_amount(query, use_portfolio_currency=self.use_portfolio_currency)
        return total

    def get_accumulated_investment_until_current_year(self) -> Decimal:
        year = date.today().year
        total = self.get_accumulated_investment_until_year(year)
        return total
