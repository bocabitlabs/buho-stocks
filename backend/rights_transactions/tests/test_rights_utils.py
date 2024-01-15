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
    def setUp(self):
        super().setUp()
        self.faker_obj = Faker()
        # Create company
        # Add shares
        self.company = CompanyFactory.create(base_currency="USD")
        self.shares_count = 0
        self.total_amount = 0
        self.total_transactions = 0
        self.years = [2018, 2020, 2021, datetime.date.today().year]
        self.counts = [1, 2, 3, 4]
        self.total_amounts = [1, 2, 3, 4]
        self.accumulated_counts = [1, 3, 6, 10]
        self.prices = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        self.exchange_rate = Decimal(0.5)
        self.commissions = [Decimal(1), Decimal(2), Decimal(3), Decimal(4)]
        self.prices_times_counts = [
            self.total_amounts[0] * self.exchange_rate
            + self.commissions[0] * self.exchange_rate,  # 50.5
            self.total_amounts[1] * self.exchange_rate
            + self.commissions[1] * self.exchange_rate,  # 50.5
            self.total_amounts[2] * self.exchange_rate
            + self.commissions[2] * self.exchange_rate,  # 50.5
            self.total_amounts[3] * self.exchange_rate
            + self.commissions[3] * self.exchange_rate,  # 50.5
        ]
        for index in range(0, len(self.years)):
            first_datetime = datetime.datetime.strptime(
                f"{self.years[index]}-01-01", "%Y-%m-%d"
            )
            RightsTransactionFactory.create(
                company=self.company,
                gross_price_per_share_currency="EUR",
                total_amount=self.total_amounts[index],
                total_amount_currency="EUR",
                total_commission=self.commissions[index],
                total_commission_currency="EUR",
                count=self.counts[index],
                type=TransactionType.BUY,
                gross_price_per_share=self.prices[index],
                exchange_rate=self.exchange_rate,
                transaction_date=datetime.date(
                    first_datetime.year, first_datetime.month, first_datetime.day
                ),
            )
            self.shares_count += self.counts[index]
            self.total_transactions += 1

    # def setUp(self):
    #     pass

    def test_calculate_invested_on_year(self):
        index = 0
        logger.debug(self.company)
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.calculate_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

        index = 3
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.calculate_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

    def test_get_accumulated_investment_until_current_year(self):
        index = len(self.prices_times_counts) - 1

        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.get_accumulated_investment_until_current_year(),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )

    def test_calculate_invested_on_year_all(self):
        index = 3
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.calculate_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )

    def test_get_accumulated_investment_on_year(self):
        index = 3
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.calculate_accumulated_investment_until_year(self.years[index]),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )
        index = 1
        utils = RightsTransactionCalculator(
            self.company.rights_transactions,
        )
        self.assertEqual(
            utils.calculate_accumulated_investment_until_year(self.years[index]),
            reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
        )
        index = 0
        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(
            utils.calculate_invested_on_year(self.years[index]),
            self.prices_times_counts[index],
        )
