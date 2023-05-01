import logging

from companies.models import Company
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from stats.serializers.company_stats import CompanyStatsForYearSerializer
from stats.utils.company_stats_utils import CompanyStatsUtils

logger = logging.getLogger("buho_backend")


class CompanyStatsAPIView(APIView):
    def get_object(self, company_id, year, update_api_price=False):
        try:
            company_stats = CompanyStatsUtils(company_id, year=year, update_api_price=update_api_price)
            instance = company_stats.get_stats_for_year()
            return instance
        except Company.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stats"])
    def get(self, request, company_id, year, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        instance = self.get_object(company_id, year)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CompanyStatsForYearSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["company_stats"])
    def put(self, request, company_id, year, *args, **kwargs):
        """
        Update the company stats for a given year
        """
        update_api_price = request.data.get("update_api_price", False)

        if year == "all":
            year = 9999
        instance = self.get_object(company_id, year, update_api_price=update_api_price)

        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CompanyStatsForYearSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
