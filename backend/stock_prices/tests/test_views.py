import logging

from auth.tests.factory import UserFactory
from companies.tests.factory import CompanyFactory
from rest_framework.test import APITestCase
from stock_prices.tests.factory import StockPriceTransactionFactory

logger = logging.getLogger("buho_backend")


class StockPricesTransactionsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.company = CompanyFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = StockPriceTransactionFactory.create(price_currency=cls.company.base_currency)
            instances.append(instance)
        cls.instances = instances
