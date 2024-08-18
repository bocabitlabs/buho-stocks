from django.urls import reverse
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from initialize_data.initializers.currencies import create_initial_currencies


class CurrenciesViewsTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.available_currencies_count = 13
        create_initial_currencies()

    def test_get_currencies(self):
        url = reverse("currencies-list")
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.available_currencies_count)

        self.assertEqual(
            response.data[0]["name"],
            "Australian dollar",
        )
        self.assertEqual(
            response.data[-1]["code"],
            "USD",
        )
        self.assertEqual(
            response.data[round(self.available_currencies_count / 2)]["symbol"],
            "HK$",
        )
