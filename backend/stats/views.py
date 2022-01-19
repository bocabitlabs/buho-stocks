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
from portfolios.models import Portfolio
from shares_transactions.models import SharesTransaction
from stats.models import PortfolioStatsForYear
from stats.serializers import CompanyStatsForYearSerializer, PortfolioStatsForYearSerializer

from stats.utils import CompanyStatsUtils, PortfolioStatsUtils, CompanyUtils

logger =logging.getLogger("buho_backend")

class CompanyStatsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id):
        try:
            company_stats = CompanyStatsUtils(company_id, user_id, year=year)
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


class CompanyStatsForceAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id):
        try:
            company_stats = CompanyStatsUtils(
                company_id, user_id, year=year, force=True
            )
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


class PortfolioStatsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, year, user_id, force=False, group_by=None):
        try:
            if group_by in ["month", "company"]:
                stats = self.get_stats_grouped(portfolio_id, year, user_id, force, group_by)
                return stats

            stats = self.get_stats_for_year(portfolio_id, year, user_id, force)
            return stats
        except PortfolioStatsForYear.DoesNotExist:
            return None

    def get_stats_for_year(self, portfolio_id, year, user_id, force):
        portfolio_stats = PortfolioStatsUtils(portfolio_id, user_id, year=year, force=force)
        if(year == "all-years"):
            stats = portfolio_stats.get_all_years_stats()
        else:
            stats = portfolio_stats.get_stats_for_year()
            serializer = PortfolioStatsForYearSerializer(stats)
            stats = serializer.data
        return stats

    def get_stats_grouped(self, portfolio_id, year, user_id, force, group_by):
        portfolio_stats = PortfolioStatsUtils(portfolio_id, user_id, year=year, force=force)
        if group_by == "month":
            if year == "all":
                stats = portfolio_stats.get_dividends_for_all_years_monthly()
            else:
                stats = portfolio_stats.get_dividends_for_year_monthly()
        if group_by == "company":
            stats = portfolio_stats.get_stats_for_year_by_company()
            serializer = CompanyStatsForYearSerializer(stats, many=True)
            stats = serializer.data
        return stats

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        group_by = self.request.query_params.get('groupBy')

        stats = self.get_object(portfolio_id, year, request.user.id, group_by=group_by)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_stats"])
    def put(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, year, request.user.id, force=True)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)
