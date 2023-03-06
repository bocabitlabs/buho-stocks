from currencies.views.admin import create_initial_currencies
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class CurrenciesViewsTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.available_currencies_count = 13
        create_initial_currencies()

    def test_get_currencies(self):
        url = reverse("currency-list")
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
