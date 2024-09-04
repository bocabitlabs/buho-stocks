import logging

from faker import Faker

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from rights_transactions.calculators import RightsTransactionCalculator
from rights_transactions.tests import (
    create_first_rights_sales_transaction,
    create_first_rights_transaction,
    create_second_rights_sales_transaction,
    create_second_rights_transaction,
    create_third_rights_transaction,
)

logger = logging.getLogger("buho_backend")

# def test_calculate_invested_on_year(self):
#         index = 0
#         logger.debug(self.company)
#         utils = RightsTransactionCalculator(self.company.rights_transactions)
#         self.assertEqual(
#             utils.calculate_invested_on_year(self.years[index]),
#             self.prices_times_counts[index],
#         )

#         index = 3
#         utils = RightsTransactionCalculator(self.company.rights_transactions)
#         self.assertEqual(
#             utils.calculate_invested_on_year(self.years[index]),
#             self.prices_times_counts[index],
#         )

#     def test_get_accumulated_investment_until_current_year(self):
#         index = len(self.prices_times_counts) - 1

#         utils = RightsTransactionCalculator(self.company.rights_transactions)
#         self.assertEqual(
#             utils.get_accumulated_investment_until_current_year(),
#             reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
#         )

#     def test_calculate_invested_on_year_all(self):
#         index = 3
#         utils = RightsTransactionCalculator(
#             self.company.rights_transactions,
#         )
#         self.assertEqual(
#             utils.calculate_invested_on_year(self.years[index]),
#             self.prices_times_counts[index],
#         )

#     def test_get_accumulated_investment_on_year(self):
#         index = 3
#         utils = RightsTransactionCalculator(
#             self.company.rights_transactions,
#         )
#         self.assertEqual(
#             utils.calculate_accumulated_investment_until_year(self.years[index]),
#             reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
#         )
#         index = 1
#         utils = RightsTransactionCalculator(
#             self.company.rights_transactions,
#         )
#         self.assertEqual(
#             utils.calculate_accumulated_investment_until_year(self.years[index]),
#             reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
#         )
#         index = 0
#         utils = RightsTransactionCalculator(self.company.rights_transactions)
#         self.assertEqual(
#             utils.calculate_invested_on_year(self.years[index]),
#             self.prices_times_counts[index],
#         )


class RightsInvestedTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.faker_obj = Faker()
        self.company = CompanyFactory.create()

    def test_rights_invested_on_year(self):

        first_date = create_first_rights_transaction(self.company)
        second_date = create_second_rights_transaction(self.company)

        utils = RightsTransactionCalculator(self.company.rights_transactions)
        self.assertEqual(utils.calculate_invested_on_year(first_date.year), 95)
        self.assertEqual(utils.calculate_invested_on_year(second_date.year), 140)

    def test_rights_get_accumulated_invested_for_two_transactions(self):

        create_first_rights_transaction(self.company)
        create_second_rights_transaction(self.company)
        create_third_rights_transaction(self.company)

        transactions = self.company.rights_transactions
        utils = RightsTransactionCalculator(transactions)
        self.assertEqual(utils.get_accumulated_investment_until_current_year(), 415)

    def test_rights_get_invested_on_year(self):

        first_datetime = create_first_rights_transaction(self.company)
        second_datetime = create_second_rights_transaction(self.company)
        third_datetime = create_third_rights_transaction(self.company)

        transactions = self.company.rights_transactions
        utils = RightsTransactionCalculator(transactions)

        self.assertEqual(utils.calculate_invested_on_year(first_datetime.year), 100 - 5)

        self.assertEqual(
            utils.calculate_invested_on_year(second_datetime.year), 150 - 10
        )
        self.assertEqual(
            utils.calculate_invested_on_year(third_datetime.year), 200 - 20
        )

    def test_shares_calculate_invested_on_year_all(self):

        create_first_rights_transaction(self.company)
        create_second_rights_transaction(self.company)
        create_third_rights_transaction(self.company)

        transactions = self.company.rights_transactions
        utils = RightsTransactionCalculator(transactions)

        total = 450
        commissions = 5 + 10 + 20
        self.assertEqual(utils.calculate_invested_on_year(9999), total - commissions)

    def test_rights_calculate_invested_accummulated_with_sales(self):

        create_first_rights_transaction(self.company)
        create_second_rights_transaction(self.company)
        third_date = create_third_rights_transaction(self.company)
        create_first_rights_sales_transaction(self.company)  # 100 - 5
        create_second_rights_sales_transaction(self.company)  # 150 - 10

        transactions = self.company.rights_transactions
        utils = RightsTransactionCalculator(transactions)
        total = 415 - 235  # 180

        self.assertEqual(
            utils.calculate_accumulated_investment_until_year(third_date.year),
            total,
        )
