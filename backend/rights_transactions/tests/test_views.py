import logging
from decimal import Decimal

import factory
from django.urls import reverse
from faker import Faker
from rest_framework import status

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from rights_transactions.models import RightsTransaction
from rights_transactions.tests.factory import RightsTransactionFactory

logger = logging.getLogger("buho_backend")


class RightsTransactionsListTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.faker_obj = Faker()

    def test_get_rights(self):
        company = CompanyFactory.create()
        base_url = reverse("rights-list")
        url = f"{base_url}?company={company.id}"
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            RightsTransactionFactory.create(
                company=company,
                gross_price_per_share_currency=company.base_currency,
                total_commission_currency=company.base_currency,
            )

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class RightsTransactionsDetailTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.company = CompanyFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = RightsTransactionFactory.create(
                company=cls.company,
                gross_price_per_share_currency=cls.company.base_currency,
                total_commission_currency=cls.company.base_currency,
            )
            instances.append(instance)
        cls.instances = instances

    def test_get_shares(self):
        index = 0
        url = reverse("rights-detail", args=[self.instances[index].id])
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
        url = reverse("rights-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            Decimal(response.data["total_commission"]),
            self.instances[index].total_commission.amount,
        )
        self.assertEqual(
            response.data["total_commission_currency"],
            str(self.instances[index].total_commission.currency),
        )

    def test_update_rights_transaction(self):
        index = 0
        temp_data = factory.build(dict, FACTORY_CLASS=RightsTransactionFactory)
        temp_data["company"] = self.company.id
        temp_data["gross_price_per_share_currency"] = self.company.base_currency
        temp_data["total_commission_currency"] = self.company.base_currency

        url = reverse("rights-detail", args=[self.instances[index].id])
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
        url = reverse("rights-detail", args=[self.instances[0].id])
        response = self.client.delete(url)
        # Check status response

        trans = RightsTransaction.objects.all()
        self.assertEqual(len(trans), 3)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(RightsTransaction.DoesNotExist):
            RightsTransaction.objects.get(id=self.instances[0].id)
