from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from companies.models import Company
from portfolios.models import Portfolio
from shares_transactions.models import SharesTransaction

from stats.models import CompanyStats, PortfolioStats


class CompanyStatsAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, user_id):
        try:
            company_stats = CompanyStats(company_id, user_id, year=year)
            stats = company_stats.get_stats_for_year()
            return stats
        except Company.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, company_id, year, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        stats = self.get_object(company_id, year, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, year, user_id):
        try:
            company_stats = PortfolioStats(portfolio_id, user_id, year=year)
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


class CompanyStatsYearsAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, user_id):
        try:
            company = Company.objects.get(id=company_id, user=user_id)
            first_year = company.shares_transactions.order_by(
                "transaction_date"
            ).first()
            return first_year.transaction_date.year
        except Company.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["stats"])
    def get(self, request, company_id, *args, **kwargs):
        """
        Retrieve the company years
        """
        stats = self.get_object(company_id, request.user.id)
        if not stats:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsYearsAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, user_id):
        try:
            transactions = SharesTransaction.objects.filter(
                company__portfolio=portfolio_id, user=user_id
            )
            first_year = transactions.order_by("transaction_date").first()
            print(f"first_year: {first_year}")
            if not first_year:
                return None
            return first_year.transaction_date.year
        except Company.DoesNotExist:
            print("No transactions found")
            return None

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
