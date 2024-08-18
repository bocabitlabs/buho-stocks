from django.urls import reverse
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase


class UserSettingsDetailTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()

    def test_update_settings(self):
        temp_data = {
            "language": "en",
            "timezone": "Europe/Paris",
            "backend_hostname": "",
            "sentry_enabled": False,
            "sentry_dsn": "",
        }
        url = reverse("user-settings-detail")
        response = self.client.put(url, temp_data)
        # Check status response
        print("-----------------------------------------------")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["language"],
            temp_data["language"],
        )
        self.assertEqual(
            response.data["timezone"],
            temp_data["timezone"],
        )
