import logging
from datetime import datetime

from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from exchange_rates.models import ExchangeRate
from exchange_rates.serializers import ExchangeRateSerializer
from exchange_rates.services.exchange_rate_fetcher import ExchangeRateFetcher

logger = logging.getLogger("buho_backend")


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """Get all the exchange rates from a user"""

    pagination_class = LimitOffsetPagination
    serializer_class = ExchangeRateSerializer
    queryset = ExchangeRate.objects.all()

    def get_queryset(self):
        sort_by = self.request.query_params.get("sort_by", "exchangeDate")
        order_by = self.request.query_params.get("order_by", "desc")

        sort_by_fields = {
            "exchangeDate": "exchange_date",
            "exchangeRate": "exchange_rate",
            "exchangeFrom": "exchange_from",
            "exchangeTo": "exchange_to",
        }

        # Sort and order the queryset
        if order_by == "desc":
            queryset = ExchangeRate.objects.order_by(f"-{sort_by_fields[sort_by]}")
        else:
            queryset = ExchangeRate.objects.order_by(f"{sort_by_fields[sort_by]}")

        return queryset


class ExchangeRateDetailAPIView(APIView):
    """Operations for a single Exchange rate"""

    @swagger_auto_schema(tags=["exchange_rates"])
    def get(
        self,
        request,
        exchange_from: str,
        exchange_to: str,
        exchange_date: str,
        *args,
        **kwargs,
    ):
        """
        Retrieve the market item with given exchange_name
        """
        # exchange_date_as_datetime = datetime.strptime(exchange_date, "%Y-%m-%d")
        logger.debug("exchange_date: %s", exchange_date)
        exchange_date_as_datetime_from_iso_string = datetime.fromisoformat(
            exchange_date
        )
        exchange_rate_fetcher = ExchangeRateFetcher()
        exchange_rate = exchange_rate_fetcher.get_exchange_rate_for_date(
            exchange_from, exchange_to, exchange_date_as_datetime_from_iso_string
        )

        if not exchange_rate:
            return Response(
                {"res": "Exchange rate does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ExchangeRateSerializer(exchange_rate)
        return Response(serializer.data, status=status.HTTP_200_OK)
