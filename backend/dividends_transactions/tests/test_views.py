import logging
from decimal import Decimal

import factory
from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.tests.factory import DividendsTransactionFactory

logger = logging.getLogger("buho_backend")


class DividendsTransactionsListTestCase(BaseApiTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.faker_obj = Faker()

    def test_get_dividends(self):
        company = CompanyFactory.create()
        base_url = reverse("dividends-list")
        url = f"{base_url}?company={company.id}"
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            DividendsTransactionFactory.create(
                company=company,
                gross_price_per_share_currency=company.base_currency,
                total_commission_currency=company.base_currency,
            )

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class DividendsTransactionsDetailTestCase(BaseApiTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.company = CompanyFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = DividendsTransactionFactory.create(
                company=self.company,
                gross_price_per_share_currency=self.company.base_currency,
                total_commission_currency=self.company.base_currency,
            )
            instances.append(instance)
        self.instances = instances

    def test_get_dividends(self):
        index = 0
        url = reverse("dividends-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["count"],
            self.instances[index].count,
        )
        self.assertEqual(
            Decimal(response.data["exchange_rate"]),
            self.instances[index].exchange_rate,
        )
        self.assertEqual(
            Decimal(response.data["total_amount"]),
            self.instances[index].total_amount.amount,
        )
        self.assertEqual(
            response.data["total_amount_currency"],
            str(self.instances[index].total_amount.currency),
        )
        index = len(self.instances) - 1
        url = reverse("dividends-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        logger.debug(response.data)
        self.assertEqual(
            Decimal(response.data["total_commission"]),
            self.instances[index].total_commission.amount,
        )
        self.assertEqual(
            response.data["total_commission_currency"],
            str(self.instances[index].total_commission.currency),
        )

    def test_update_dividends_transaction(self):
        index = 0
        temp_data = factory.build(dict, FACTORY_CLASS=DividendsTransactionFactory)
        temp_data["company"] = self.company.id
        temp_data["gross_price_per_share_currency"] = self.company.base_currency
        temp_data["total_commission_currency"] = self.company.base_currency

        url = reverse("dividends-detail", args=[self.instances[index].id])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Decimal(response.data["count"]),
            temp_data["count"],
        )
        self.assertEqual(
            Decimal(response.data["total_commission"]),
            temp_data["total_commission"],
        )
        self.assertEqual(
            response.data["notes"],
            temp_data["notes"],
        )

    def test_delete_transaction(self):
        url = reverse("dividends-detail", args=[self.instances[0].id])
        response = self.client.delete(url)
        # Check status response

        trans = DividendsTransaction.objects.all()
        self.assertEqual(len(trans), 3)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(DividendsTransaction.DoesNotExist):
            DividendsTransaction.objects.get(id=self.instances[0].id)
