import datetime
import logging
import pathlib
from decimal import Decimal
from os import path

import responses
from exchange_rates.services.exchange_rate_service import ExchangeRateService
from exchange_rates.tests.factory import ExchangeRateFactory
from faker import Faker
from responses import _recorder
from rest_framework.test import APITestCase

logger = logging.getLogger("buho_backend")


class ExchangeRateServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()
        instances = []
        cls.years = [2018, 2020, 2021, 2022]
        cls.exchange_dates = [
            "2018-01-01",
            "2020-01-01",
            "2021-01-01",
            "2022-01-01",
        ]
        cls.not_found_date = f"{cls.years[3]}-08-04"
        cls.exchange_rates = [Decimal(10), Decimal(20), Decimal(30), Decimal(40)]
        cls.from_currency = "USD"
        cls.to_currency = "EUR"
        for index in range(0, 4):
            first_datetime = cls.exchange_dates[index]
            instance = ExchangeRateFactory.create(
                exchange_from=cls.from_currency,
                exchange_to=cls.to_currency,
                exchange_rate=cls.exchange_rates[index],
                exchange_date=first_datetime,
            )
            instances.append(instance)
        cls.instances = instances

    # def setUp(self):
    #     pass

    def test_get_exchange_rate_for_date(self):
        index = 3
        service = ExchangeRateService()
        rate = service.get_exchange_rate_for_date(self.from_currency, self.to_currency, self.exchange_dates[index])
        if not rate:
            self.fail("Rate not found")
        self.assertEqual(
            rate.exchange_from,
            self.from_currency,
        )
        self.assertEqual(
            rate.exchange_to,
            self.to_currency,
        )

        # convert self.exchange_dates[index] to datetime.date
        date = datetime.datetime.strptime(self.exchange_dates[index], "%Y-%m-%d").date()
        self.assertEqual(
            rate.exchange_date,
            date,
        )
        self.assertEqual(
            rate.exchange_rate,
            self.exchange_rates[index],
        )

    def test_get_exchange_rate_for_date_same_currency(self):
        index = 3
        same_currency_exchange_rate = {
            "exchange_from": "USD",
            "exchange_to": "USD",
            "exchange_date": "2022-01-01",
            "exchange_rate": "1.000",
        }
        service = ExchangeRateService()
        value = service.get_exchange_rate_for_date(self.from_currency, self.from_currency, self.exchange_dates[index])

        if not value:
            self.fail("Rate not found")

        self.assertEqual(
            value.exchange_from,
            same_currency_exchange_rate["exchange_from"],
        )

        self.assertEqual(
            value.exchange_to,
            same_currency_exchange_rate["exchange_to"],
        )

        # date = datetime.datetime.strptime(self.exchange_dates[index], "%Y-%m-%d").date()
        self.assertEqual(
            value.exchange_date,
            same_currency_exchange_rate["exchange_date"],
        )
        self.assertEqual(
            value.exchange_rate,
            same_currency_exchange_rate["exchange_rate"],
        )

    @responses.activate
    def test_get_exchange_rate_not_found_in_db(self):
        responses_path = path.join(
            pathlib.Path(__file__).parent.parent,
            "responses",
            "out.yaml",
        )
        responses.patch("https://query2.finance.yahoo.com")
        responses._add_from_file(file_path=responses_path)

        service = ExchangeRateService()
        result = service.get_exchange_rate_for_date(self.from_currency, self.to_currency, self.not_found_date)

        if not result:
            self.fail("Rate not found")

        self.assertEqual(result.exchange_from, "USD")
        self.assertEqual(result.exchange_to, "EUR")
        self.assertEqual(result.exchange_rate, 0.9844800233840942)

    @responses.activate
    def test_get_exchange_rate_not_found_at_all(self):
        responses_path = path.join(
            pathlib.Path(__file__).parent.parent,
            "responses",
            "out_error.yaml",
        )
        responses.patch("https://query2.finance.yahoo.com")
        responses._add_from_file(file_path=responses_path)

        service = ExchangeRateService()
        result = service.get_exchange_rate_for_date("ABCDE", self.to_currency, self.not_found_date)
        self.assertIsNone(result)