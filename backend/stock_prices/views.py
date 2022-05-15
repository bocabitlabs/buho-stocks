from rest_framework.response import Response
import logging
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from buho_backend.utils.token_utils import ExpiringTokenAuthentication
from companies.models import Company
from stock_prices.api import StockPricesApi
from stock_prices.serializers import StockPriceSerializer
from stock_prices.services.custom_yfinance_service import CustomYFinanceService

logger = logging.getLogger("buho_backend")


class StockPricesYearAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_update_object(self, company_id, year, user_id):
        company = Company.objects.get(id=company_id, user=user_id)
        api_service = CustomYFinanceService()
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
        try:
            instance = self.get_update_object(company_id, year, request.user.id)
        except Exception as error:
            logger.exception(error)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
