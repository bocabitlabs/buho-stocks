import logging

from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from log_messages.models import LogMessage
from log_messages.tests.factory import LogMessageFactory
from portfolios.tests.factory import PortfolioFactory

logger = logging.getLogger("buho_backend")


class LogMessagesListTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()

    def test_get_companies(self):
        portfolio = PortfolioFactory.create()
        url = reverse("log-message-list", args=[portfolio.id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            LogMessageFactory.create(portfolio=portfolio)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class CompanisDetailTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.portfolio = PortfolioFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = LogMessageFactory.create(portfolio=cls.portfolio)
            instances.append(instance)
        cls.instances = instances

    def test_delete_company(self):
        url = reverse("log-message-detail", args=[self.portfolio.id, self.instances[0].id])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(LogMessage.DoesNotExist):
            LogMessage.objects.get(id=self.instances[0].id)
