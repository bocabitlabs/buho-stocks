import datetime
import logging

from faker import Faker

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from shares_transactions.calculators.shares_transaction_calculator import (
    SharesTransactionCalculator,
)
from shares_transactions.tests import (
    create_first_shares_sales_transaction,
    create_first_shares_transaction,
    create_second_shares_sales_transaction,
    create_second_shares_transaction,
    create_third_shares_transaction,
)

logger = logging.getLogger("buho_backend")


class SharesInvestedTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.faker_obj = Faker()
        self.company = CompanyFactory.create()

    def test_shares_get_accumulated_investment_until_current_year(self):

        create_first_shares_transaction(self.company)
        create_second_shares_transaction(self.company)

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(utils.get_accumulated_investment_until_current_year(), 235)

    def test_shares_get_accumulated_invested_for_two_transactions(self):

        create_first_shares_transaction(self.company)
        create_second_shares_transaction(self.company)
        create_third_shares_transaction(self.company)

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        self.assertEqual(utils.get_accumulated_investment_until_current_year(), 415)

    def test_shares_get_accumulated_commission_for_two_transactions(self):

        create_first_shares_transaction(self.company)
        create_second_shares_transaction(self.company)

        utils = SharesTransactionCalculator(self.company.shares_transactions)

        self.assertEqual(
            utils.calculate_total_commissions_until_year(datetime.date.today().year), 15
        )
        self.assertEqual(
            utils.get_accumulated_investment_until_current_year()
            + utils.calculate_total_commissions_until_year(datetime.date.today().year),
            250,
        )

    def test_shares_get_invested_on_year(self):

        first_datetime = create_first_shares_transaction(self.company)
        second_datetime = create_second_shares_transaction(self.company)
        third_datetime = create_third_shares_transaction(self.company)

        utils = SharesTransactionCalculator(self.company.shares_transactions)

        self.assertEqual(utils.calculate_invested_on_year(first_datetime.year), 100 - 5)

        self.assertEqual(
            utils.calculate_invested_on_year(second_datetime.year), 150 - 10
        )
        self.assertEqual(
            utils.calculate_invested_on_year(third_datetime.year), 200 - 20
        )

    def test_shares_calculate_invested_on_year_all(self):

        create_first_shares_transaction(self.company)
        create_second_shares_transaction(self.company)
        create_third_shares_transaction(self.company)

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        total = 450
        commissions = 5 + 10 + 20
        self.assertEqual(utils.calculate_invested_on_year(9999), total - commissions)

    def test_shares_calculate_invested_accummulated_with_sales(self):

        create_first_shares_transaction(self.company)  # 100 - 5
        create_second_shares_transaction(self.company)  # 150 - 10
        third_transaction_date = create_third_shares_transaction(
            self.company
        )  # 200 - 20
        create_first_shares_sales_transaction(self.company)  # 100 - 5
        create_second_shares_sales_transaction(self.company)  # 150 - 10

        utils = SharesTransactionCalculator(self.company.shares_transactions)
        total = 415 - 235  # 180

        self.assertEqual(
            utils.calculate_accumulated_investment_until_year(
                third_transaction_date.year
            ),
            total,
        )
