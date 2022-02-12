from datetime import date
from decimal import Decimal
import logging
from buho_backend.transaction_types import TransactionType
from shares_transactions.models import SharesTransaction, Transaction

logger = logging.getLogger("buho_backend")

class TransactionsUtils:
    def get_transaction_amount(
        self,
        transaction: Transaction,
        use_currency="portfolio",
    ) -> Decimal:
        exchange_rate = 1
        if use_currency == "portfolio":
            exchange_rate = transaction.exchange_rate

        total = (
            transaction.gross_price_per_share.amount * transaction.count * exchange_rate
            + transaction.total_commission.amount * exchange_rate
        )
        return total

    def get_transactions_amount(
        self, transactions: list[Transaction], use_currency="portfolio"
    ) -> Decimal:
        total = 0
        for item in transactions:
            total += self.get_transaction_amount(item, use_currency=use_currency)
        return total


class SharesTransactionsUtils:
    def __init__(
        self,
        shares_transactions: list[SharesTransaction],
        use_currency: str = "portfolio",
    ):
        self.shares_transactions = shares_transactions
        self.use_currency = use_currency

    def _get_transactions_query(self, year: int, filter: str = None, only_buy: bool = True):
        """[summary]

        Args:
            filter (str, optional): accumulated to obtain the accummulated values.
            Otherwhise will get the values for a give year or all Defaults to None.

        Returns:
            [type]: [description]
        """
        query = self.shares_transactions
        if filter == "accumulated":
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        if only_buy:
            query.filter(type=TransactionType.BUY)

        return query

    def get_invested_on_year(self, year: int):
        total = 0
        query = self._get_transactions_query(year)
        total = TransactionsUtils().get_transactions_amount(
            query, use_currency=self.use_currency
        )
        return total

    def get_accumulated_investment_until_year(self, year: int):
        total = 0
        query = self._get_transactions_query(year, filter="accumulated")
        total = TransactionsUtils().get_transactions_amount(
            query, use_currency=self.use_currency
        )
        return total

    def get_accumulated_investment_until_current_year(self):
        year = date.today().year
        total = self.get_accumulated_investment_until_year(year)
        return total

    def get_shares_count_until_year(self, year: int) -> int:
        """Get the total number of shares of the company for all the years
        or until a given year (accummulated value).

        Returns:
            int: Total number of shares
        """
        total = 0
        query = self._get_transactions_query(year, filter="accumulated", only_buy=False)

        for item in query:
            if item.type == TransactionType.BUY:
                total += item.count
            else:
                total -= item.count
        return total

    def get_shares_count_on_year(self, year: int) -> int:
        """Get the total number of shares of the company for all the years
        or until a given year (accummulated value).

        Returns:
            int: Total number of shares
        """
        total = 0
        query = self._get_transactions_query(year, only_buy=False)

        for item in query:
            if item.type == TransactionType.BUY:
                total += item.count
            else:
                total -= item.count
        return total

    def get_shares_count_until_current_year(self):
        year = date.today().year
        total = self.get_shares_count_until_year(year)
        return total