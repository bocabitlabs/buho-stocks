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
        cls.counts = [1, 2, 3, 4]
        cls.total_amounts = [1, 2, 3, 4]
        cls.accumulated_counts = [1, 3, 6, 10]
        cls.prices = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        cls.exchange_rate = Decimal(0.5)
        cls.commissions = [Decimal(0.5), Decimal(1), Decimal(2), Decimal(3)]
        cls.prices_times_counts = [
            1 * cls.exchange_rate - cls.commissions[0] * cls.exchange_rate,  # 50.5
            2 * cls.exchange_rate - cls.commissions[1] * cls.exchange_rate,  # 201
            3 * cls.exchange_rate - cls.commissions[2] * cls.exchange_rate,  # 451.5
            4 * cls.exchange_rate - cls.commissions[3] * cls.exchange_rate,  # 802
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
                total_amount=cls.total_amounts[index],
                total_commission=cls.commissions[index],
                transaction_date=datetime.date(first_datetime.year, first_datetime.month, first_datetime.day),
            )
            cls.shares_count += cls.counts[index]
            cls.total_transactions += 1

    # def setUp(self):
    #     pass

    def test_get_dividends_on_year(self):
        index = 0
        utils = DividendsTransactionsUtils(self.company.dividends_transactions)
        for dividend_transaction in self.company.dividends_transactions.all():
            logger.info(f"Dividend transaction: {dividend_transaction}")
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
