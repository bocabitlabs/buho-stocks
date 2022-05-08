import datetime
from decimal import Decimal
from functools import reduce
import json
import pathlib
from unittest.mock import patch
from faker import Faker
from rest_framework.test import APITestCase
from auth.tests.factory import UserFactory
from buho_backend.transaction_types import TransactionType
from companies.tests.factory import CompanyFactory
import logging

from exchange_rates.tests.factory import ExchangeRateFactory
from exchange_rates.utils import ExchangeRatesUtils


logger = logging.getLogger("buho_backend")


class ExchangeRateUtilsTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.faker_obj = Faker()
        instances = []
        cls.years = [2018, 2020, 2021, datetime.date.today().year]
        cls.days_with_month_year = [
            f"{cls.years[0]}-01-01",
            f"{cls.years[1]}-01-01",
            f"{cls.years[2]}-01-01",
            f"{cls.years[3]}-01-01",
        ]
        cls.not_found_date = f"{cls.years[3]}-01-20"
        cls.exchange_rates = [Decimal(10), Decimal(20), Decimal(30), Decimal(40)]
        cls.from_currency = "USD"
        cls.to_currency = "EUR"
        for index in range(0, 4):
            first_datetime = datetime.datetime.strptime(
                cls.days_with_month_year[index], "%Y-%m-%d"
            )
            instance = ExchangeRateFactory.create(
                exchange_from=cls.from_currency,
                exchange_to=cls.to_currency,
                exchange_rate=cls.exchange_rates[index],
                exchange_date=datetime.date(
                    first_datetime.year, first_datetime.month, first_datetime.day
                ),
            )
            instances.append(instance)
        cls.instances = instances

    # def setUp(self):
    #     pass

    def test_get_exchange_rate_for_date(self):
        index = 3
        utils = ExchangeRatesUtils()
        self.assertEqual(
            utils.get_exchange_rate_for_date(
                self.from_currency, self.to_currency, self.days_with_month_year[index]
            ),
            self.exchange_rates[index],
        )

    def test_get_exchange_rate_for_date_same_currency(self):
        index = 3
        same_currency_exchange_rate = Decimal(1)
        utils = ExchangeRatesUtils()
        self.assertEqual(
            utils.get_exchange_rate_for_date(
                self.from_currency, self.from_currency, self.days_with_month_year[index]
            ),
            same_currency_exchange_rate,
        )

    @patch(
        "forex_python.converter.CurrencyRates.get_rates"
    )
    def test_get_exchange_rate_not_found(self, mock_request):
        expected_eur_value = 1
        with open(f"{pathlib.Path(__file__).parent.resolve()}/api_response.json") as f:
            response_text = json.load(f)
        mock_request.return_value = response_text

        utils = ExchangeRatesUtils()
        self.assertEqual(
            utils.get_exchange_rate_for_date(
                self.from_currency, self.to_currency, self.not_found_date
            ),
            expected_eur_value,
        )

    #     index = 0
    #     utils = RightsTransactionsUtils(self.company.rights_transactions)
    #     self.assertEqual(
    #         utils.get_invested_on_year(self.years[index]),
    #         self.prices_times_counts[index],
    #     )

    # def test_get_accumulated_investment_until_current_year(self):
    #     index = 3
    #     utils = RightsTransactionsUtils(self.company.rights_transactions)
    #     self.assertEqual(
    #         utils.get_accumulated_investment_until_current_year(),
    #         reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
    #     )

    # def test_get_accumulated_investment_on_year(self):
    #     index = 3
    #     utils = RightsTransactionsUtils(self.company.rights_transactions)
    #     self.assertEqual(
    #         utils.get_accumulated_investment_until_year(self.years[index]),
    #         reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
    #     )
    #     index = 0
    #     utils = RightsTransactionsUtils(self.company.rights_transactions)
    #     self.assertEqual(
    #         utils.get_accumulated_investment_until_year(self.years[index]),
    #         reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
    #     )

    # def test_get_invested_on_year_all(self):
    #     index = 3
    #     utils = RightsTransactionsUtils(
    #         self.company.rights_transactions,
    #     )
    #     self.assertEqual(
    #         utils.get_invested_on_year(self.years[index]),
    #         self.prices_times_counts[index],
    #     )

    # def test_get_accumulated_investment_on_year(self):
    #     index = 3
    #     utils = RightsTransactionsUtils(
    #         self.company.rights_transactions,
    #     )
    #     self.assertEqual(
    #         utils.get_accumulated_investment_until_year(self.years[index]),
    #         reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
    #     )
    #     index = 1
    #     utils = RightsTransactionsUtils(
    #         self.company.rights_transactions,
    #     )
    #     self.assertEqual(
    #         utils.get_accumulated_investment_until_year(self.years[index]),
    #         reduce(lambda a, b: a + b, self.prices_times_counts[: index + 1]),
    #     )
    #     index = 0
    #     utils = RightsTransactionsUtils(
    #         self.company.rights_transactions
    #     )
    #     self.assertEqual(
    #         utils.get_invested_on_year(self.years[index]),
    #         self.prices_times_counts[index],
    #     )
