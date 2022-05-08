from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from auth.tests.factory import UserFactory
from django.contrib.auth.models import User

class UserSettingsListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.url = reverse("user-settings-list")
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_user_settings(self):
        response = self.client.get(self.url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("id", response.data)
        self.assertIn("company_display_mode", response.data)
        self.assertIn("language", response.data)
        self.assertIn("main_portfolio", response.data)
        self.assertIn("portfolio_sort_by", response.data)
        self.assertIn("portfolio_display_mode", response.data)
        self.assertIn("company_sort_by", response.data)
        self.assertIn("company_display_mode", response.data)


class UserSettingsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_update_settings(self):
        temp_data = {"language": "en", "timezone": "Europe/Paris"}
        url = reverse("user-settings-detail", args=[self.user_saved.usersettings.id])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(len(User.objects.all()), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["language"],
            temp_data["language"],
        )
        self.assertEqual(
            response.data["timezone"],
            temp_data["timezone"],
        )
