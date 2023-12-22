import datetime
import logging
from decimal import Decimal
from functools import reduce

from faker import Faker

from buho_backend.tests.base_test_case import BaseApiTestCase
from buho_backend.transaction_types import TransactionType
from companies.tests.factory import CompanyFactory
from rights_transactions.calculators import RightsTransactionCalculator
from rights_transactions.tests.factory import RightsTransactionFactory

logger = logging.getLogger("buho_backend")


class RightsInvestedTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()
        # Create company
        # Add shares
        cls.company = CompanyFactory.create(base_currency="USD")
        cls.shares_count = 0
        cls.total_amount = 0
        cls.total_transactions = 0
        cls.years = [2018, 2020, 2021, datetime.date.today().year]
        cls.counts = [1, 2, 3, 4]
        cls.total_amounts = [1, 2, 3, 4]
        cls.accumulated_counts = [1, 3, 6, 10]
        cls.prices = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        cls.exchange_rate = Decimal(0.5)
        cls.commissions = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        cls.prices_times_counts = [
            cls.total_amounts[0] * cls.exchange_rate + cls.commissions[0] * cls.exchange_rate,  # 50.5
            cls.total_amounts[1] * cls.exchange_rate + cls.commissions[1] * cls.exchange_rate,  # 50.5
            cls.total_amounts[2] * cls.exchange_rate + cls.commissions[2] * cls.exchange_rate,  # 50.5
            cls.total_amounts[3] * cls.exchange_rate + cls.commissions[3] * cls.exchange_rate,  # 50.5
        ]
        for index in range(0, len(cls.years)):
            first_datetime = datetime.datetime.strptime(f"{cls.years[index]}-01-01", "%Y-%m-%d")
            RightsTransactionFactory.create(
                company=cls.company,
                gross_price_per_share_currency="EUR",
                total_amount=cls.total_amounts[index],
                total_amount_currency="EUR",
                total_commission=cls.commissions[index],
                total_commission_currency="EUR",
                count=cls.counts[index],
                type=TransactionType.BUY,
                gross_price_per_share=cls.prices[index],
                exchange_rate=cls.exchange_rate,
                transaction_date=datetime.date(first_datetime.year, first_datetime.month, first_datetime.day),
            )
            cls.shares_count += cls.counts[index]
            cls.total_transactions += 1

    # def setUp(self):
    #     pass

    def test_get_invested_on_year(self):
        index = 0
        logger.debug(self.company)
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.get_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

        index = 3
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.get_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

    def test_get_accumulated_investment_until_current_year(self):
        index = len(self.prices_times_counts) - 1

        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.get_accumulated_investment_until_current_year(),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )

    def test_get_invested_on_year_all(self):
        index = 3
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.get_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

    def test_get_accumulated_investment_on_year(self):
        index = 3
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.get_accumulated_investment_until_year(self.years[index]),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )
        index = 1
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.get_accumulated_investment_until_year(self.years[index]),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )
        index = 0
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.get_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )
