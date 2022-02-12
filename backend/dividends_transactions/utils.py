from datetime import date
from decimal import Decimal
from dividends_transactions.models import DividendsTransaction


class DividendsTransactionsUtils:
    def __init__(self, transactions: list[DividendsTransaction], use_currency: str):
        self.transactions = transactions
        self.use_currency = use_currency

    def _get_transactions_query(self, year: int, filter: str = None):
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

        return query

    def _get_transaction_amount(self, item: DividendsTransaction) -> Decimal:
        exchange_rate = 1
        if self.use_currency == "portfolio":
            exchange_rate = item.exchange_rate
        total = (
            item.gross_price_per_share.amount * exchange_rate * item.count
            - item.total_commission.amount * exchange_rate
        )
        return total

    def _get_transactions_amount(self, query: list[DividendsTransaction]) -> Decimal:
        total = 0
        for item in query:
            total += self._get_transaction_amount(item)
        return total

    def get_dividends_of_year(self, year: int):
        total = 0
        query = self._get_transactions_query(year)
        total = self._get_transactions_amount(query)
        return total

    def get_accumulated_dividends_until_year(self, year: int):
        total = 0
        query = self._get_transactions_query(year, filter="accumulated")
        total = self._get_transactions_amount(query)
        return total
