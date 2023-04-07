from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UserSettingsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()

    def test_update_settings(self):
        temp_data = {"language": "en", "timezone": "Europe/Paris"}
        url = reverse("user-settings-detail")
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["language"],
            temp_data["language"],
        )
        self.assertEqual(
            response.data["timezone"],
            temp_data["timezone"],
        )
