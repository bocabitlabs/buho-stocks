import logging

from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer

logger = logging.getLogger("buho_backend")


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 1000


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """Get all the exchange rates from a user"""

    pagination_class = StandardResultsSetPagination
    serializer_class = StockPriceSerializer

    def get_queryset(self):
        sort_by = self.request.query_params.get("sort_by", "transaction_date")
        order_by = self.request.query_params.get("order_by", "desc")
        # Sort and order the queryset
        if order_by == "desc":
            queryset = StockPrice.objects.order_by(f"-{sort_by}")
        else:
            queryset = StockPrice.objects.order_by(f"{sort_by}")

        return queryset
