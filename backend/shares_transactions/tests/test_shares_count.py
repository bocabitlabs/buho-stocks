import datetime
import logging

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

    def test_get_shares_count_for_one_transaction(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=0,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(utils.get_shares_count_until_current_year(), 10)

    def test_get_shares_count_for_two_transactions(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=0,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=0,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(utils.get_shares_count_until_current_year(), 20)

    def test_get_shares_count_for_year(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_on_year(first_datetime.year),
            10,
        )
        self.assertEqual(
            utils.calculate_shares_count_on_year(second_datetime.year),
            10,
        )

    def test_get_shares_count_on_year_accumulated(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_until_year(first_datetime.year),
            10,
        )
        self.assertEqual(
            utils.calculate_shares_count_until_year(second_datetime.year),
            20,
        )

    def test_get_shares_count_with_positive_sells(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.SELL,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_on_year(first_datetime.year),
            10,
        )
        self.assertEqual(
            utils.calculate_shares_count_on_year(second_datetime.year),
            -10,
        )

    def test_get_shares_count_with_negative_sells(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=-10,
            total_amount=100,
            type=TransactionType.SELL,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_on_year(first_datetime.year),
            10,
        )
        self.assertEqual(
            utils.calculate_shares_count_on_year(second_datetime.year),
            -10,
        )

    def test_get_shares_count_with_positive_sells_accumulated(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.SELL,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_until_year(first_datetime.year),
            10,
        )
        self.assertEqual(
            utils.calculate_shares_count_until_year(second_datetime.year),
            0,
        )

    def test_get_shares_count_with_negative_sells_accumulated(self):

        first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
        second_datetime = datetime.datetime.strptime(
            f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=10,
            total_amount=100,
            type=TransactionType.BUY,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                first_datetime.year, first_datetime.month, first_datetime.day
            ),
        )

        SharesTransactionFactory.create(
            company=self.company,
            gross_price_per_share_currency=self.company.base_currency,
            total_commission_currency=self.company.base_currency,
            count=-10,
            total_amount=100,
            type=TransactionType.SELL,
            gross_price_per_share=10,
            exchange_rate=1,
            total_commission=5,
            transaction_date=datetime.date(
                second_datetime.year, second_datetime.month, second_datetime.day
            ),
        )

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(
            utils.calculate_shares_count_until_year(first_datetime.year),
            20,
        )
        self.assertEqual(
            utils.calculate_shares_count_until_year(second_datetime.year),
            10,
        )
