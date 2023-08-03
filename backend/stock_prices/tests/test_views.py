import logging

from buho_backend.tests.base_test_case import BaseApiTestCase
from companies.tests.factory import CompanyFactory
from stock_prices.tests.factory import StockPriceTransactionFactory

logger = logging.getLogger("buho_backend")


class StockPricesTransactionsDetailTestCase(BaseApiTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.company = CompanyFactory.create()
        instances = []
        for _ in range(0, 4):
            instance = StockPriceTransactionFactory.create(price_currency=cls.company.base_currency)
            instances.append(instance)
        cls.instances = instances
