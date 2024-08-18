import datetime
import logging
from decimal import Decimal

from faker import Faker

from buho_backend.tests.base_test_case import BaseApiTestCase
from buho_backend.transaction_types import TransactionType
from companies.tests.factory import CompanyFactory
from shares_transactions.calculators.shares_transaction_calculator import (
    SharesTransactionCalculator,
)
from shares_transactions.tests.factory import SharesTransactionFactory

logger = logging.getLogger("buho_backend")


class SharesCountTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.faker_obj = Faker()
        # Create company
        # Add shares
        self.company = CompanyFactory.create()
        self.shares_count = 0
        self.total_amount = 0
        self.total_transactions = 0
        self.years = [2018, 2020, 2021, datetime.date.today().year]
        self.counts = [10, 20, 30, 40, 50]
        self.accumulated_counts = [10, 30, 60, 100, 150]
        self.prices = [Decimal(10), Decimal(20), Decimal(30), Decimal(40), Decimal(50)]
        self.exchange_rate = 0.5
        self.commissions = [Decimal(1), Decimal(2), Decimal(3), Decimal(4), Decimal(5)]
        self.prices_times_counts = [
            10 * 10 * self.exchange_rate + self.exchange_rate * 1,
            20 * 20 * self.exchange_rate + self.exchange_rate * 2,
            30 * 30 * self.exchange_rate + self.exchange_rate * 3,
            40 * 40 * self.exchange_rate + self.exchange_rate * 4,
            50 * 50 * self.exchange_rate + self.exchange_rate * 5,
        ]
        self.sell_counts = [1, 2, 3, 4, 5]
        self.sell_prices = [
            Decimal(5),
            Decimal(10),
            Decimal(15),
            Decimal(20),
            Decimal(25),
        ]
        self.accumulated_counts_after_sell = [9, 27, 54, 90, 135]

        for index in range(0, len(self.years)):
            first_datetime = datetime.datetime.strptime(
                f"{self.years[index]}-01-01", "%Y-%m-%d"
            )
            SharesTransactionFactory.create(
                company=self.company,
                gross_price_per_share_currency=self.company.base_currency,
                total_commission_currency=self.company.base_currency,
                count=self.counts[index],
                type=TransactionType.BUY,
                gross_price_per_share=self.prices[index],
                exchange_rate=self.exchange_rate,
                total_commission=self.commissions[index],
                transaction_date=datetime.date(
                    first_datetime.year, first_datetime.month, first_datetime.day
                ),
            )
            self.shares_count += self.counts[index]
            self.total_transactions += 1

    # def setUp(self):
    #     pass

    def test_get_transactions_count(self):
        self.assertEqual(
            len(self.company.shares_transactions.all()), self.total_transactions
        )

    def test_get_shares_count_for_all(self):
        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(utils.get_shares_count_until_current_year(), self.shares_count)

    def test_get_shares_count_for_year(self):
        for index in range(0, len(self.years)):
            utils = SharesTransactionCalculator(self.company.shares_transactions)
            self.assertEqual(
                utils.calculate_shares_count_on_year(self.years[index]),
                self.counts[index],
            )

    def test_get_shares_count_with_sells(self):
        for index in range(0, len(self.years)):
            first_datetime = datetime.datetime.strptime(
                f"{self.years[index]}-01-01", "%Y-%m-%d"
            )
            SharesTransactionFactory.create(
                company=self.company,
                gross_price_per_share=self.sell_prices[index],
                gross_price_per_share_currency=self.company.base_currency,
                total_commission=self.commissions[index],
                total_commission_currency=self.company.base_currency,
                count=self.sell_counts[index],
                type=TransactionType.SELL,
                exchange_rate=self.exchange_rate,
                transaction_date=datetime.date(
                    first_datetime.year, first_datetime.month, first_datetime.day
                ),
            )
            self.shares_count -= self.sell_counts[index]
            self.total_transactions += 1
        self.assertEqual(
            len(self.company.shares_transactions.all()), self.total_transactions
        )

        # utils = SharesTransactionCalculator(self.company.shares_transactions)
        # self.assertEqual(
        #     utils.get_accumulated_investment_until_current_year(), self.shares_count
        # )

        for index in range(0, len(self.years)):
            utils = SharesTransactionCalculator(self.company.shares_transactions)

            self.assertEqual(
                utils.calculate_shares_count_until_year(self.years[index]),
                self.accumulated_counts_after_sell[index],
            )
