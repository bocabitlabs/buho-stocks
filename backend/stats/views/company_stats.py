import logging

from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company
from stats.calculators.company_stats_utils import CompanyStatsCalculator
from stats.serializers.company_stats import CompanyStatsForYearSerializer
from stats.tasks import update_portfolio_stats

logger = logging.getLogger("buho_backend")


class CompanyStatsAPIView(APIView):
    def get_object(self, company_id, year, update_api_price=False):
        try:
            company_stats = CompanyStatsCalculator(
                company_id, year=year, update_api_price=update_api_price
            )
            instance = company_stats.get_year_stats(year)
            return instance
        except Company.DoesNotExist:
            return None

    def update_object(self, company_id, year, update_api_price=False):
        logger.debug("Updating company stats")
        company = Company.objects.get(id=company_id)
        update_portfolio_stats.delay(
            company.portfolio_id, [company_id], year, update_api_price
        )
        return True

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stats"])
    def get(self, request, company_id, year, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        if year == "all":
            year = settings.YEAR_FOR_ALL
        instance = self.get_object(company_id, year)
        if not instance:
            return Response(None, status=status.HTTP_200_OK)
        serializer = CompanyStatsForYearSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["company_stats"],
    )
    def put(self, request, company_id, year, *args, **kwargs):
        """
        Update the company stats for a given year
        """
        update_api_price = request.data.get("update_api_price", False)
        instance = self.update_object(
            company_id, year, update_api_price=update_api_price
        )

        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(instance, status=status.HTTP_200_OK)
