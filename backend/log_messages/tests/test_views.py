from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from auth.tests.factory import UserFactory
from log_messages.models import LogMessage
from log_messages.tests.factory import LogMessageFactory
from portfolios.tests.factory import PortfolioFactory
import logging

logger = logging.getLogger("buho_backend")


class LogMessagesListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_companies(self):
        portfolio = PortfolioFactory.create(user=self.user_saved)
        url = reverse("log-message-list", args=[portfolio.id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            LogMessageFactory.create(user=self.user_saved, portfolio=portfolio)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class CompanisDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.portfolio = PortfolioFactory.create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = LogMessageFactory.create(user=cls.user_saved, portfolio=cls.portfolio)
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_delete_company(self):
        url = reverse("log-message-detail", args=[self.portfolio.id, self.instances[0].id])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(LogMessage.DoesNotExist):
            LogMessage.objects.get(id=self.instances[0].id)