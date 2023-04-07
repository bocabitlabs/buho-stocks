import logging
import pathlib
from os import path

import responses
from exchange_rates.services.ecb_api_client import EcbApiClient
from rest_framework.test import APITestCase

logger = logging.getLogger("buho_backend")


class EcbApiTestCase(APITestCase):
    @responses.activate
    def test_get_exchange_rate_for_date(self):
        api_client = EcbApiClient()

        response_text = ""
        with open(
            path.join(
                pathlib.Path(__file__).parent.resolve(),
                "responses",
                "ecb_resp_usd_eur.csv",
            ),
            encoding="utf-8",
        ) as file:
            response_text = file.read()
        responses.add(
            responses.GET,
            api_client.build_endpoint_url("USD", "EUR"),
            body=str(response_text),
            status=200,
            content_type="text/csv",
        )
        result = api_client.get_exchange_rate_for_date("USD", "EUR", "2022-08-04")
        self.assertEqual(
            result["exchange_from"],
            "USD",
        )
        self.assertEqual(
            result["exchange_to"],
            "EUR",
        )
        self.assertEqual(
            result["exchange_date"],
            "2022-08-04",
        )
        self.assertEqual(
            result["exchange_rate"],
            0.9823182711198428,
        )

    @responses.activate
    def test_get_no_exists(self):
        api_client = EcbApiClient()

        response_text = ""
        with open(
            path.join(
                pathlib.Path(__file__).parent.resolve(),
                "responses",
                "ecb_resp_no_exists.csv",
            ),
            encoding="utf-8",
        ) as file:
            response_text = file.read()
        responses.add(
            responses.GET,
            api_client.build_endpoint_url("USD", "EUR"),
            body=str(response_text),
            status=200,
        )
        result = api_client.get_exchange_rate_for_date("USD", "EUR", "2022-01-01")
        self.assertEqual(result, None)

    @responses.activate
    def test_get_no_results(self):
        api_client = EcbApiClient()

        response_text = ""
        with open(
            path.join(
                pathlib.Path(__file__).parent.resolve(),
                "responses",
                "ecb_resp_no_results.csv",
            ),
            encoding="utf-8",
        ) as file:
            response_text = file.read()
        responses.add(
            responses.GET,
            api_client.build_endpoint_url("EUR", "EUR"),
            body=str(response_text),
            status=200,
        )
        result = api_client.get_exchange_rate_for_date("EUR", "EUR", "2022-01-01")
        self.assertEqual(result, None)
