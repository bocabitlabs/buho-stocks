import logging

from companies.models import Company
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from settings.models import UserSettings
from stock_prices.api import StockPricesApi
from stock_prices.serializers import StockPriceSerializer
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class StockPricesYearAPIView(APIView):
    """Operations for a single Shares Transaction"""

    def get_update_object(self, company_id, year):
        company = Company.objects.get(id=company_id)
        api_service = YFinanceApiClient()
        api = StockPricesApi(api_service)
        data = api.get_last_data_from_year(company.ticker, year, only_api=True)
        return data

    @swagger_auto_schema(
        tags=["Stock Prices"],
        operation_id="Update stock price",
        operation_description="Update the last stock price of a company of a given year",
        responses={200: StockPriceSerializer(many=False)},
    )
    def put(self, request, company_id, year, *args, **kwargs):
        """
        Update last stock price of a company for a given year
        """
        logger.info(f"Updating stock price for company {company_id} and year {year}")
        settings = UserSettings.objects.get(1)
        instance = None
        if settings.allow_fetch:
            instance = self.get_update_object(company_id, year)

        if instance:
            serializer = StockPriceSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {
                "res": (
                    f"Unable to retrieve stock price for company {company_id}. "
                    f"Verify the API logs. Allow fetch was: {settings.allow_fetch}"
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
