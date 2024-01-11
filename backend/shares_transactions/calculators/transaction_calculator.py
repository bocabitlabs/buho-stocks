import logging
from decimal import Decimal

from django.db.models.query import QuerySet

from shares_transactions.models import Transaction

logger = logging.getLogger("buho_backend")


class TransactionCalculator:
    def calculate_single_transaction_amount(
        self,
        transaction: Transaction,
        use_portfolio_currency: bool = True,
    ) -> Decimal:
        """Get the total amount of a transaction, calculating the price
        based on the number of shares, the exchange rate and the commission

        Args:
            transaction (Transaction): A given Transaction object
            use_portfolio_currency (bool, optional): If set to portfolio, it will use the exchange
            rate stored on the transaction (Will correspond to the exchange rate
            of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of the transaction
        """

        exchange_rate: Decimal = Decimal(1)
        total = Decimal(0)
        if use_portfolio_currency:
            exchange_rate = transaction.exchange_rate

        total = (transaction.total_amount.amount * exchange_rate) + (
            transaction.total_commission.amount * exchange_rate
        )
        return total

    def calculate_transactions_amount(self, transactions: QuerySet, use_portfolio_currency: bool = True) -> Decimal:
        """Get the total amount of a list of transactions

        Args:
            transactions (list[Transaction]): A list of transactions
            use_portfolio_currency (bool, optional): If set to portfolio, it will use the exchange
            rate stored on the transaction (Will correspond to the exchange rate
            of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of all the transactions
        """
        total: Decimal = Decimal(0)
        for item in transactions:
            total += self.calculate_single_transaction_amount(item, use_portfolio_currency=use_portfolio_currency)
        return total
