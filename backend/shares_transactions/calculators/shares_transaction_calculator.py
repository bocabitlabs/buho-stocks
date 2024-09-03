import logging
from datetime import date
from decimal import Decimal

from django.conf import settings
from django.db.models.query import QuerySet

from buho_backend.transaction_types import TransactionType
from shares_transactions.calculators.transaction_calculator import TransactionCalculator
from shares_transactions.models import SharesTransaction

logger: logging.Logger = logging.getLogger("buho_backend")


class SharesTransactionCalculator:
    def __init__(
        self,
        shares_transactions: QuerySet[SharesTransaction],
        use_portfolio_currency: bool = True,
    ):
        self.shares_transactions: QuerySet[SharesTransaction] = shares_transactions
        self.use_portfolio_currency: bool = use_portfolio_currency

    def _get_multiple_transactions_query(
        self, year: int, use_accumulated: bool = False, only_buy: bool = False
    ) -> QuerySet[SharesTransaction]:
        """Get the transactions query for a given year based on the parameters.

        Args:
            year (int): Year to get the transactions.
            use_accumulated (bool, optional): Whether or not to get the accumulated
            transactions
            until the given year. Defaults to False.
            only_buy (bool, optional): Whether or not to get only the transactions of
            BUY type.
            Defaults to False.

        Returns:
            _type_: _description_
        """
        query = self.shares_transactions
        if only_buy:
            query = query.filter(type=TransactionType.BUY)

        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

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
        query = self.shares_transactions
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
    ) -> QuerySet[SharesTransaction]:
        query: QuerySet[SharesTransaction] = self.shares_transactions

        query = query.filter(type=TransactionType.BUY)

        if year == settings.YEAR_FOR_ALL:
            return query

        if use_accumulated:
            query = query.filter(transaction_date__year__lte=year)
        else:
            query = query.filter(transaction_date__year=year)

        return query

    def calculate_invested_on_year(self, year: int) -> Decimal:
        """Get the total invested on a given year.

        Args:
            year (int): Year (2019, 2020, etc) to get the total invested.

        Returns:
            Decimal: The total invested amount.
        """
        total: Decimal = Decimal(0)
        # BUY
        buy_query = self._get_multiple_buy_transactions_query(year)
        transactions_calculator = TransactionCalculator()
        buy_total = transactions_calculator.calculate_transactions_amount(
            buy_query, use_portfolio_currency=self.use_portfolio_currency
        )
        # SELL
        sell_query = self._get_multiple_sell_transactions_query(year)
        transactions_calculator = TransactionCalculator()
        sell_total = transactions_calculator.calculate_transactions_amount(
            sell_query, use_portfolio_currency=self.use_portfolio_currency
        )

        total = buy_total - sell_total

        return total

    def calculate_accumulated_investment_until_year_excluding_last_sale(
        self, year: int
    ) -> Decimal:
        total: Decimal = Decimal(0)
        # BUY
        query = self._get_multiple_buy_transactions_query(year, use_accumulated=True)
        transactions_calculator = TransactionCalculator()
        buy_total = transactions_calculator.calculate_transactions_amount(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        # SELL
        query = self._get_multiple_sell_transactions_query(year, use_accumulated=True)
        # Remove the last transaction from the sell query
        last_transaction = query.last()
        if last_transaction:
            query = query.exclude(id=last_transaction.id)
        transactions_calculator = TransactionCalculator()
        sell_total = transactions_calculator.calculate_transactions_amount(
            query, use_portfolio_currency=self.use_portfolio_currency
        )

        total = buy_total - sell_total

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

    def calculate_shares_count_until_year(self, year: int) -> int:
        """Get the total number of shares of the company for all the years
        or until a given year (accumulated value).

        Args:
            year (int): The latest year to get the accumulated value.

        Returns:
            int: Total number of shares
        """
        total = 0
        query = self._get_multiple_transactions_query(year, use_accumulated=True)

        for item in query:
            if item.type == TransactionType.BUY:
                total += item.count
            else:
                # If its a sell transaction but the count is possitive
                if item.count > 0:
                    total -= item.count
                else:
                    total += item.count
        return total

    def calculate_shares_count_on_year(self, year: int) -> int:
        """Get the total number of shares of the company for all the years
        or until a given year (accumulated value).

        Args:
            year (int): The year to get the shares count.

        Returns:
            int: Total shares count
        """
        total = 0
        query = self._get_multiple_transactions_query(year)

        for item in query:
            # If its a sell transaction but the count is possitive
            if item.count > 0:
                total -= item.count
            else:
                total += item.count
        return total

    def get_shares_count_until_current_year(self) -> int:
        year = date.today().year
        total = self.calculate_shares_count_until_year(year)
        return total

    def calculate_total_sales_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        if year == settings.YEAR_FOR_ALL:
            year = date.today().year

        query = self._get_multiple_sell_transactions_query(year, use_accumulated=True)

        transactions_utils = TransactionCalculator()
        total = transactions_utils.calculate_investments(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        # logger.debug(f"Total accumulated return from sales: {total}")
        return total

    def calculate_total_investments_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        if year == settings.YEAR_FOR_ALL:
            year = date.today().year

        query = self._get_multiple_buy_transactions_query(year, use_accumulated=True)

        transactions_utils = TransactionCalculator()
        total = transactions_utils.calculate_investments(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        # logger.debug(f"Total accumulated return from sales: {total}")
        return total

    def calculate_total_commissions_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        if year == settings.YEAR_FOR_ALL:
            year = date.today().year

        query = self._get_multiple_transactions_query(year, use_accumulated=True)

        transactions_utils = TransactionCalculator()
        total = transactions_utils.calculate_commissions(
            query, use_portfolio_currency=self.use_portfolio_currency
        )
        # logger.debug(f"Total accumulated return from sales: {total}")
        return total
