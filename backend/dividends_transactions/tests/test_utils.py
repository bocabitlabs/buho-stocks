import datetime
import logging
from decimal import Decimal
from functools import reduce

from companies.tests.factory import CompanyFactory
from dividends_transactions.tests.factory import DividendsTransactionFactory
from dividends_transactions.utils import DividendsTransactionsUtils
from faker import Faker
from rest_framework.test import APITestCase

logger = logging.getLogger("buho_backend")


class DividendsUtilsTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()
        # Create company
        # Add shares
        cls.company = CompanyFactory.create()
        cls.shares_count = 0
        cls.total_amount = 0
        cls.total_transactions = 0
        cls.years = [2018, 2020, 2021, datetime.date.today().year]
        cls.counts = [10, 20, 30, 40]
        cls.accumulated_counts = [10, 30, 60, 100]
        cls.prices = [Decimal(10), Decimal(20), Decimal(30), Decimal(40)]
        cls.exchange_rate = 0.5
        cls.commissions = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        cls.prices_times_counts = [
            10 * 10 * cls.exchange_rate - cls.exchange_rate * 1,  # 50.5
            20 * 20 * cls.exchange_rate - cls.exchange_rate * 2,  # 201
            30 * 30 * cls.exchange_rate - cls.exchange_rate * 3,  # 451.5
            40 * 40 * cls.exchange_rate - cls.exchange_rate * 4,  # 802
        ]
        for index in range(0, len(cls.years)):
            first_datetime = datetime.datetime.strptime(f"{cls.years[index]}-01-01", "%Y-%m-%d")
            DividendsTransactionFactory.create(
                company=cls.company,
                gross_price_per_share_currency=cls.company.base_currency,
                total_commission_currency=cls.company.base_currency,
                count=cls.counts[index],
                gross_price_per_share=cls.prices[index],
                exchange_rate=cls.exchange_rate,
                total_commission=cls.commissions[index],
                transaction_date=datetime.date(first_datetime.year, first_datetime.month, first_datetime.day),
            )
            cls.shares_count += cls.counts[index]
            cls.total_transactions += 1

    # def setUp(self):
    #     pass

    def test_get_dividends_on_year(self):
        index = 3
        utils = DividendsTransactionsUtils(self.company.dividends_transactions)
        self.assertEqual(
            utils.get_dividends_of_year(self.years[index]),
            self.prices_times_counts[index],
        )

        index = 0
        utils = DividendsTransactionsUtils(self.company.dividends_transactions)
        self.assertEqual(
            utils.get_dividends_of_year(self.years[index]),
            self.prices_times_counts[index],
        )

    def test_get_accumulated_dividends_until_current_year(self):
        index = 3
        utils = DividendsTransactionsUtils(self.company.dividends_transactions)
        self.assertEqual(
            utils.get_accumulated_dividends_until_current_year(),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )
