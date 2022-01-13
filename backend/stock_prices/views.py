from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
import logging
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from companies.models import Company
from stock_prices.api import StockPricesApi
from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer
from stock_prices.services.custom_yfinance_service import CustomYFinanceService

logger = logging.getLogger("buho_backend")

class StockPricesListAPIView(APIView):
    """Get all the shares transactions from a user's company"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, *args, **kwargs):
        """
        List all the company items for given requested user
        """
        elements = StockPrice.objects.filter(user=request.user.id, company=company_id)
        serializer = StockPriceSerializer(elements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StockPricesDetailAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, transaction_date, user_id):
        try:
            return StockPrice.objects.get(
                company=company_id, transaction_date=transaction_date, user=user_id
            )
        except StockPrice.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, transaction_date, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        instance = self.get_object(company_id, transaction_date, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StockPricesYearAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id):
        company = Company.objects.get(id=company_id, user=user_id)
        api_service = CustomYFinanceService()
        api = StockPricesApi(api_service)
        data = api.get_last_data_from_year(company.ticker, year)
        return data


    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, year, position, *args, **kwargs):
        """
        Get the first or last stock price of a company for a given year

        - position: first|last

        """
        instance = self.get_object(company_id, year, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StockPricesYearForceAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id):
        company = Company.objects.get(id=company_id, user=user_id)
        api_service = CustomYFinanceService()
        api = StockPricesApi(api_service, force=True)
        data = api.get_last_data_from_year(company.ticker, year)
        return data


    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, year, position, *args, **kwargs):
        """
        Get the first or last stock price of a company for a given year

        - position: first|last

        """
        instance = self.get_object(company_id, year, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
