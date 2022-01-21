from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from auth.tests.factory import UserFactory

class CurrenciesViewsTestCase(APITestCase):

    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.available_currencies_count = 32
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_currencies(self):
        url = reverse('currency-list')
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.available_currencies_count)

        self.assertEqual(
            response.data[0]['name'],
            "Australian dollar",
        )
        self.assertEqual(
            response.data[-1]['code'],
            "ZAR",
        )
        self.assertEqual(
            response.data[round(self.available_currencies_count/2)]['symbol'],
            "¥",
        )
