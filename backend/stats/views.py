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
from stats.serializers import CompanyStatsForYearSerializer

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
    @swagger_auto_schema(tags=["stats"])
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
    @swagger_auto_schema(tags=["stats"])
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

    def get_object(self, portfolio_id, year, user_id):
        try:
            portfolio_stats = PortfolioStatsUtils(portfolio_id, user_id, year=year)
            if(year == "all-years"):
                stats = portfolio_stats.get_all_years_stats()
            else:
                stats = portfolio_stats.get_stats_for_year()
            return stats
        except Portfolio.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, year, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsForceAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, year, user_id):
        try:
            company_stats = PortfolioStatsUtils(
                portfolio_id, user_id, year=year, force=True
            )
            stats = company_stats.get_stats_for_year()
            return stats
        except Portfolio.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, year, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsByCompanyAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, year, user_id):
        try:
            company_stats = PortfolioStatsUtils(
                portfolio_id, user_id, year=year
            )
            stats = company_stats.get_stats_for_year_by_company()
            return stats
        except Portfolio.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, year, request.user.id)
        serializer = CompanyStatsForYearSerializer(stats, many=True)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        logger.debug(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PortfolioDividendStatsMonthlyAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, year, user_id):
        try:
            stats = PortfolioStatsUtils(
                portfolio_id, user_id, year=year
            )
            if year == "all":
                stats = stats.get_dividends_for_all_years_monthly()
            else:
                stats = stats.get_dividends_for_year_monthly()
            return stats
        except Portfolio.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id, year, request.user.id)
        # serializer = CompanyStatsForYearSerializer(stats, many=True)
        if not stats:
            return Response(
                {"res": "Object with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # logger.debug(serializer.data)
        return Response(stats, status=status.HTTP_200_OK)

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, portfolio_id, *args, **kwargs):
        """
        Retrieve the company years
        """
        stats = self.get_object(portfolio_id, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)
