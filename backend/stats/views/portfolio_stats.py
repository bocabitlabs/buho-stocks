import logging
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from settings.models import UserSettings
from buho_backend.utils.token_utils import ExpiringTokenAuthentication
from stats.models.portfolio_stats import PortfolioStatsForYear
from stats.serializers.company_stats import CompanyStatsForYearSerializer
from stats.serializers.portfolio_stats import PortfolioStatsForYearSerializer

from stats.utils.portfolio_utils import PortfolioStatsUtils

logger =logging.getLogger("buho_backend")


class PortfolioStatsAPIView(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
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
        stats = portfolio_stats.get_stats_for_year()
        logger.debug(stats)
        serializer = PortfolioStatsForYearSerializer(stats)
        stats = serializer.data
        logger.debug(stats)
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
        Update the portfolio item with given id
        """
        settings = UserSettings.objects.get(user=request.user)
        if settings.allow_fetch:
            forced = self.request.query_params.get('force')
            if forced == "true":
                forced = True
        else:
            forced = False
        stats = self.get_object(portfolio_id, year, request.user.id, force=forced)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsAllYearsAPIView(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, user_id):
        try:
            stats = self.get_stats_for_year(portfolio_id, user_id)
            return stats
        except PortfolioStatsForYear.DoesNotExist:
            return None

    def get_stats_for_year(self, portfolio_id, user_id):
        portfolio_stats = PortfolioStatsUtils(portfolio_id, user_id, year=9999)
        stats = portfolio_stats.get_all_years_stats()
        return stats

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_stats"])
    def get(self, request, portfolio_id, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)
