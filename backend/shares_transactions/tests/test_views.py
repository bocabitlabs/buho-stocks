import logging
from decimal import Decimal

import factory
from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from shares_transactions.models import SharesTransaction
from shares_transactions.tests.factory import SharesTransactionFactory

logger = logging.getLogger("buho_backend")


class SharesTransactionsListTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.faker_obj = Faker()

    def test_get_shares(self):
        company = CompanyFactory.create()
        base_url = reverse("shares-list")
        url = f"{base_url}?company={company.id}"

        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            SharesTransactionFactory.create(
                company=company,
                gross_price_per_share_currency=company.base_currency,
                total_commission_currency=company.base_currency,
            )

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class SharesTransactionsDetailTestCase(BaseApiTestCase):
    def setUp(self):
        super().setUp()
        self.company = CompanyFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = SharesTransactionFactory.create(
                company=self.company,
                gross_price_per_share_currency=self.company.base_currency,
                total_commission_currency=self.company.base_currency,
            )
            instances.append(instance)
        self.instances = instances

    def test_get_shares(self):
        index = 0
        url = reverse("shares-detail", args=[self.instances[index].id])
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
            Decimal(response.data["gross_price_per_share"]),
            self.instances[index].gross_price_per_share.amount,
        )
        self.assertEqual(
            response.data["gross_price_per_share_currency"],
            str(self.instances[index].gross_price_per_share.currency),
        )
        index = len(self.instances) - 1
        url = reverse("shares-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            Decimal(response.data["total_commission"]),
            self.instances[index].total_commission.amount,
        )
        self.assertEqual(
            response.data["total_commission_currency"],
            str(self.instances[index].total_commission.currency),
        )

    def test_update_shares_transaction(self):
        index = 0
        temp_data = factory.build(dict, FACTORY_CLASS=SharesTransactionFactory)
        temp_data["company"] = self.company.id
        temp_data["gross_price_per_share_currency"] = self.company.base_currency
        temp_data["total_commission_currency"] = self.company.base_currency
        temp_data["total_amount"] = 20
        temp_data["total_amount_currency"] = self.company.base_currency

        url = reverse("shares-detail", args=[self.instances[index].id])
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
            response.data["type"],
            temp_data["type"],
        )
        self.assertEqual(
            response.data["notes"],
            temp_data["notes"],
        )

    def test_delete_transaction(self):
        url = reverse("shares-detail", args=[self.instances[0].id])
        response = self.client.delete(url)
        # Check status response

        trans = SharesTransaction.objects.all()
        self.assertEqual(len(trans), 3)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(SharesTransaction.DoesNotExist):
            SharesTransaction.objects.get(id=self.instances[0].id)
