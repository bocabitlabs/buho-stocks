from datetime import date
from decimal import Decimal

from django.db.models.query import QuerySet

from dividends_transactions.models import DividendsTransaction


class DividendsTransactionCalculator:
    def __init__(
        self,
        transactions: QuerySet[DividendsTransaction],
        use_portfolio_currency: bool = True,
    ):
        self.transactions = transactions
        self.use_portfolio_currency = use_portfolio_currency

    def _get_multiple_transactions_query(self, year: int, use_accumulated: bool = False):
        """[summary]

        Args:
            filter (str, optional): accumulated to obtain the accumulated values.
            Otherwhise will get the values for a give year or all Defaults to None.

        Returns:
            [type]: [description]
        """
        query = self.transactions
        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

    def _calculate_single_transaction_amount(self, item: DividendsTransaction) -> Decimal:
        exchange_rate = 1
        if self.use_portfolio_currency:
            exchange_rate = item.exchange_rate
        total = (item.total_amount.amount * exchange_rate) - (item.total_commission.amount * exchange_rate)
        return total

    def _calculate_multiple_transactions_amount(self, query: QuerySet[DividendsTransaction]) -> Decimal:
        total: Decimal = Decimal(0)
        for item in query:
            total += self._calculate_single_transaction_amount(item)
        return total

    def calculate_dividends_of_year(self, year: int):
        total: Decimal = Decimal(0)
        query = self._get_multiple_transactions_query(year)
        total = self._calculate_multiple_transactions_amount(query)
        return total

    def calculate_accumulated_dividends_until_year(self, year: int):
        total: Decimal = Decimal(0)
        query = self._get_multiple_transactions_query(year, use_accumulated=True)
        total = self._calculate_multiple_transactions_amount(query)
        return total

    def get_accumulated_dividends_until_current_year(self):
        year = date.today().year
        total = self.calculate_accumulated_dividends_until_year(year)
        return total
