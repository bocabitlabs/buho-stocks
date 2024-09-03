import logging
from decimal import Decimal

from django.db.models.query import QuerySet

from shares_transactions.models import Transaction

logger = logging.getLogger("buho_backend")


class TransactionCalculator:

    def calculate_transactions_amount(
        self, transactions: QuerySet[Transaction], use_portfolio_currency: bool = True
    ) -> Decimal:
        """Get the total amount of a list of transactions

        Args:
            transactions (list[Transaction]): A list of transactions
            use_portfolio_currency (bool, optional): If set to portfolio,
            it will use the exchange rate stored on the transaction
            (Will correspond to the exchange rate of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of all the transactions
        """
        total: Decimal = Decimal(0)
        for item in transactions:
            exchange_rate: Decimal = Decimal(1)
            total = Decimal(0)
            if use_portfolio_currency:
                exchange_rate = item.exchange_rate

            if item.total_amount.amount < 0:
                item.total_amount.amount *= -1

            item_total = (item.total_amount.amount * exchange_rate) + (
                item.total_commission.amount * exchange_rate
            )
            total += item_total

        return total

    def calculate_invested_amount(
        self, transactions: QuerySet, use_portfolio_currency: bool = True
    ) -> Decimal:
        """Get the total amount of a list of transactions

        Args:
            transactions (list[Transaction]): A list of transactions
            use_portfolio_currency (bool, optional): If set to portfolio,
            it will use the exchange rate stored on the transaction
            (Will correspond to the exchange rate of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of all the transactions
        """
        total: Decimal = Decimal(0)
        for transaction in transactions:
            exchange_rate: Decimal = Decimal(1)
            total = Decimal(0)
            if use_portfolio_currency:
                exchange_rate = transaction.exchange_rate

            if transaction.total_amount.amount < 0:
                transaction.total_amount.amount *= -1

            item_total = (
                transaction.total_amount.amount * exchange_rate
                - transaction.total_commission.amount * exchange_rate
            )
            total += item_total
        return total

    def calculate_investments(
        self, transactions: QuerySet, use_portfolio_currency: bool = True
    ) -> Decimal:
        """Get the total amount of a list of transactions

        Args:
            transactions (list[Transaction]): A list of transactions
            use_portfolio_currency (bool, optional): If set to portfolio,
            it will use the exchange rate stored on the transaction
            (Will correspond to the exchange rate of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of all the transactions
        """
        total: Decimal = Decimal(0)
        for transaction in transactions:
            exchange_rate: Decimal = Decimal(1)
            if use_portfolio_currency:
                exchange_rate = transaction.exchange_rate

            if transaction.total_amount.amount < 0:
                transaction.total_amount.amount *= -1

            item_total = (
                transaction.total_amount.amount * exchange_rate
                - transaction.total_commission.amount * exchange_rate
            )
            total += item_total
        return total

    def calculate_commissions(
        self, transactions: QuerySet, use_portfolio_currency: bool = True
    ) -> Decimal:
        """Get the total amount of a list of transactions

        Args:
            transactions (list[Transaction]): A list of transactions
            use_portfolio_currency (bool, optional): If set to portfolio,
            it will use the exchange rate stored on the transaction
            (Will correspond to the exchange rate of the portfolio's currency).
            Defaults to "True". Otherwise, there won't be any exchange rate conversion.

        Returns:
            Decimal: The total amount of all the transactions
        """
        total: Decimal = Decimal(0)
        for transaction in transactions:
            exchange_rate: Decimal = Decimal(1)
            total = Decimal(0)
            if use_portfolio_currency:
                exchange_rate = transaction.exchange_rate

            item_total = transaction.total_commission.amount * exchange_rate
            total += item_total
        return total
