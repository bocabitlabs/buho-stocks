import logging
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from companies.models import Company
from stats.serializers.company_stats import CompanyStatsForYearSerializer

from stats.utils.company_utils import CompanyStatsUtils

logger =logging.getLogger("buho_backend")

class CompanyStatsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id, force=False):
        try:
            company_stats = CompanyStatsUtils(company_id, user_id, year=year, force=force)
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
        instance = self.get_object(company_id, year, request.user.id)
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
        instance = self.get_object(company_id, year, request.user.id, force=True)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CompanyStatsForYearSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)