import datetime
import logging
import pathlib
from decimal import Decimal
from os import path

import responses
from exchange_rates.services.ecb_api_client import EcbApiClient
from exchange_rates.services.exchange_rate_service import ExchangeRateService
from exchange_rates.tests.factory import ExchangeRateFactory
from faker import Faker
from rest_framework.test import APITestCase

logger = logging.getLogger("buho_backend")


class ExchangeRateServiceTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()
        instances = []
        cls.years = [2018, 2020, 2021, 2022]
        cls.days_with_month_year = [
            datetime.date(cls.years[0], 1, 1),
            datetime.date(cls.years[1], 1, 1),
            datetime.date(cls.years[2], 1, 1),
            datetime.date(cls.years[3], 1, 1),
        ]
        cls.not_found_date = f"{cls.years[3]}-08-04"
        cls.exchange_rates = [Decimal(10), Decimal(20), Decimal(30), Decimal(40)]
        cls.from_currency = "USD"
        cls.to_currency = "EUR"
        for index in range(0, 4):
            first_datetime = cls.days_with_month_year[index]
            instance = ExchangeRateFactory.create(
                exchange_from=cls.from_currency,
                exchange_to=cls.to_currency,
                exchange_rate=cls.exchange_rates[index],
                exchange_date=datetime.date(first_datetime.year, first_datetime.month, first_datetime.day),
            )
            instances.append(instance)
        cls.instances = instances

    # def setUp(self):
    #     pass

    def test_get_exchange_rate_for_date(self):
        index = 3
        service = ExchangeRateService()
        value = service.get_exchange_rate_for_date(
            self.from_currency, self.to_currency, self.days_with_month_year[index]
        )
        self.assertEqual(
            value.exchange_from,
            self.from_currency,
        )
        self.assertEqual(
            value.exchange_to,
            self.to_currency,
        )
        self.assertEqual(
            value.exchange_date,
            self.days_with_month_year[index],
        )
        self.assertEqual(
            value.exchange_rate,
            self.exchange_rates[index],
        )

    def test_get_exchange_rate_for_date_same_currency(self):
        index = 3
        same_currency_exchange_rate = {
            "exchange_from": "USD",
            "exchange_to": "USD",
            "exchange_date": datetime.date(2022, 1, 1),
            "exchange_rate": "1.000",
        }
        service = ExchangeRateService()
        value = service.get_exchange_rate_for_date(
            self.from_currency, self.from_currency, self.days_with_month_year[index]
        )
        logger.debug(f"Value same currency: {value}")
        self.assertEqual(
            value.exchange_from,
            same_currency_exchange_rate["exchange_from"],
        )
        self.assertEqual(
            value.exchange_to,
            same_currency_exchange_rate["exchange_to"],
        )
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
        expected_eur_value = {
            "exchange_from": "USD",
            "exchange_to": "EUR",
            "exchange_date": "2022-08-04",
            "exchange_rate": 0.9823182711198428,
        }
        with open(
            path.join(
                pathlib.Path(__file__).parent.resolve(),
                "responses",
                "ecb_resp_usd_eur.csv",
            ),
            encoding="utf-8",
        ) as file:
            response_text = file.read()
        api_client = EcbApiClient()
        responses.add(
            responses.GET,
            api_client.build_endpoint_url("USD", "EUR"),
            body=str(response_text),
            status=200,
            content_type="text/csv",
        )

        service = ExchangeRateService()
        result = service.get_exchange_rate_for_date(self.from_currency, self.to_currency, self.not_found_date)
        self.assertEqual(result.exchange_from, expected_eur_value["exchange_from"])
        self.assertEqual(result.exchange_to, expected_eur_value["exchange_to"])
        self.assertEqual(result.exchange_rate, expected_eur_value["exchange_rate"])

    @responses.activate
    def test_get_exchange_rate_not_found_at_all(self):
        expected_eur_value = None
        with open(
            path.join(
                pathlib.Path(__file__).parent.resolve(),
                "responses",
                "ecb_resp_no_exists.csv",
            ),
            encoding="utf-8",
        ) as file:
            response_text = file.read()
        api_client = EcbApiClient()
        responses.add(
            responses.GET,
            api_client.build_endpoint_url("USD", "EUR"),
            body=str(response_text),
            status=200,
            content_type="text/csv",
        )

        utils = ExchangeRateService()
        self.assertEqual(
            utils.get_exchange_rate_for_date(self.from_currency, self.to_currency, self.not_found_date),
            expected_eur_value,
        )
