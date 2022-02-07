from decimal import Decimal
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase
from auth.tests.factory import UserFactory
from buho_backend.transaction_types import TransactionType
from companies.tests.factory import CompanyFactory
import logging
import factory

from shares_transactions.tests.factory import SharesTransactionFactory
from stats.utils.company_utils import CompanyStatsUtils


logger = logging.getLogger("buho_backend")


class CompanyUtilsTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.faker_obj = Faker()
        # Create company
        # Add shares
        cls.company = CompanyFactory.create(user=cls.user_saved)
        cls.shares_count = 0
        shares_to_add = 10
        shares_to_remove = 5
        cls.total_transactions = 0
        cls.years = [2018, 2020, 2021, 2022, 2024]
        cls.shares_count_on_year = {}
        for year in cls.years:
            for _ in range(0, 3):
                SharesTransactionFactory.create(
                    user=cls.user_saved,
                    company=cls.company,
                    gross_price_per_share_currency=cls.company.base_currency,
                    total_commission_currency=cls.company.base_currency,
                    count=shares_to_add,
                    type=TransactionType.BUY,
                    transaction_date=f"{year}-01-01",
                )
                cls.shares_count += shares_to_add
                cls.total_transactions += 1
                cls.shares_count_on_year[year] = cls.shares_count
        logger.debug(cls.shares_count_on_year)
        for year in cls.years:
            SharesTransactionFactory.create(
                user=cls.user_saved,
                company=cls.company,
                gross_price_per_share_currency=cls.company.base_currency,
                total_commission_currency=cls.company.base_currency,
                count=shares_to_remove,
                type=TransactionType.SELL,
                transaction_date=f"{year}-02-01",
            )
            cls.shares_count -= shares_to_remove
            cls.total_transactions += 1
            for year2 in cls.years:
                if year2 >= year:
                    cls.shares_count_on_year[year2] = (
                        cls.shares_count_on_year[year2] - shares_to_remove
                    )

    def setUp(self):
        pass

    def test_get_transactions_count(self):
        self.assertEqual(
            len(self.company.shares_transactions.all()), self.total_transactions
        )

    def test_get_shares_count_for_all(self):
        company_stats = CompanyStatsUtils(self.company.id, self.user_saved.id)
        self.assertEqual(company_stats.get_shares_count(), self.shares_count)

    def test_get_shares_count_for_year(self):
        accum_shares_count = 0
        logger.debug(self.shares_count_on_year)
        for year in self.years:
            accum_shares_count = self.shares_count_on_year[year]
            logger.debug(f"year: {year} accum_shares_count: {accum_shares_count}")

            company_stats = CompanyStatsUtils(
                self.company.id, self.user_saved.id, year=year
            )
            self.assertEqual(
                company_stats.get_shares_count(), accum_shares_count
            )
