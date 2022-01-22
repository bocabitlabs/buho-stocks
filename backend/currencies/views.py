from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from currencies.models import get_all_currencies, get_currency_details


class CurrencyListAPIView(APIView):
    """Get all the currencies from a user"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["currencies"])
    def get(self, request, *args, **kwargs):
        """
        List all the currency items for given requested user
        """
        currencies = get_all_currencies()
        return Response(currencies, status=status.HTTP_200_OK)
