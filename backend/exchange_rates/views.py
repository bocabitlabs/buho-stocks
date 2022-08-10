import logging
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from exchange_rates.models import ExchangeRate
from exchange_rates.serializers import ExchangeRateSerializer
from exchange_rates.services.exchange_rate_service import ExchangeRateService

logger = logging.getLogger("buho_backend")


class ExchangeRateListAPIView(APIView):
    """Get all the exchange rates from a user"""

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, *args, **kwargs):
        """
        List all the exchange_rates items for given requested user
        """
        todos = ExchangeRate.objects.all()
        serializer = ExchangeRateSerializer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExchangeRateDetailAPIView(APIView):
    """Operations for a single Exchange rate"""

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, exchange_from, exchange_to, exchange_date, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        service = ExchangeRateService()
        exchange_rate = service.get_exchange_rate_for_date(
            exchange_from, exchange_to, exchange_date
        )
        serializer = ExchangeRateSerializer(exchange_rate)

        if not serializer:
            return Response(
                {"res": "Exchange rate does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
