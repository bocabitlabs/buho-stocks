import logging
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema


from stock_markets_indexes.models import StockMarketIndex, StockMarketIndexYear

from stock_markets_indexes.serializers import (
    StockMarketIndexSerializer,
    StockMarketIndexYearSerializer,
)

logger = logging.getLogger("buho_backend")


class StockMarketIndexAPIView(APIView):

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["stock_markets_indexes"])
    def get(self, request, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        instance = StockMarketIndex.objects.all()
        serializer = StockMarketIndexSerializer(instance, many=True)

        if not serializer:
            return Response(
                {"res": "No stock markets indexes found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_200_OK)


class StockMarketIndexYearsAPIView(APIView):

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["stock_markets_indexes"])
    def get(self, request, index_id, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        instance = StockMarketIndexYear.objects.filter(index=index_id).order_by("year")
        serializer = StockMarketIndexYearSerializer(instance, many=True)

        if not serializer:
            return Response(
                {"res": "No stock markets index years found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
