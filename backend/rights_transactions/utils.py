from datetime import date
from decimal import Decimal
from buho_backend.transaction_types import TransactionType
from rights_transactions.models import RightsTransaction
from shares_transactions.utils import TransactionsUtils

class RightsTransactionsUtils:

    def __init__(self, transactions: list[RightsTransaction], use_currency: str):
        self.transactions = transactions
        self.use_currency = use_currency


    def _get_transactions_query(self, year: int, filter: str = None, only_buy: bool = True):
        """[summary]

        Args:
            filter (str, optional): accumulated to obtain the accummulated values.
            Otherwhise will get the values for a give year or all Defaults to None.

        Returns:
            [type]: [description]
        """
        query = self.transactions
        if filter == "accumulated":
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        if only_buy:
            query.filter(type=TransactionType.BUY)

        return query

    def get_invested_on_year(self, year: int) -> Decimal:
          """Get the total amount invested on a given year

          Returns:
              Decimal: Total amount invested on rights
          """
          total = 0
          query = self._get_transactions_query(year)
          total = TransactionsUtils().get_transactions_amount(
              query, use_currency=self.use_currency
          )
          return total

    def get_accumulated_investment_until_year(self, year: int) -> Decimal:
        """Get the total amount invested until a given year (included)

        Returns:
            [type]: [description]
        """
        total = 0
        query = self._get_transactions_query(year, filter="accumulated")
        total = TransactionsUtils().get_transactions_amount(
            query, use_currency=self.use_currency
        )
        return total