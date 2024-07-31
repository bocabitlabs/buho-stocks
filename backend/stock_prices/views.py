import logging

from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer

logger = logging.getLogger("buho_backend")


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """Get all the exchange rates from a user"""

    pagination_class = LimitOffsetPagination
    serializer_class = StockPriceSerializer

    def get_queryset(self):
        sort_by = self.request.query_params.get("sort_by", "transactionDate")
        order_by = self.request.query_params.get("order_by", "desc")

        sort_by_fields = {
            "transactionDate": "transaction_date",
            "transactionPrice": "transaction_price",
            "ticker": "ticker",
            "priceCurrency": "price_currency",
            "price": "price",
        }

        # Sort and order the queryset
        if order_by == "desc":
            queryset = StockPrice.objects.order_by(f"-{sort_by_fields[sort_by]}")
        else:
            queryset = StockPrice.objects.order_by(f"{sort_by_fields[sort_by]}")

        return queryset
