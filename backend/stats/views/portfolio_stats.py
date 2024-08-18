import logging

from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.calculators.portfolio_stats_utils import PortfolioStatsUtils
from stats.models.portfolio_stats import PortfolioStatsForYear
from stats.serializers.company_stats import CompanyStatsForYearSerializer
from stats.serializers.portfolio_stats import PortfolioStatsForYearSerializer
from stats.tasks import update_portfolio_stats

logger = logging.getLogger("buho_backend")

ids_param = openapi.Parameter(
    "companiesIds",
    openapi.IN_QUERY,
    description="List of ids separated by ','",
    type=openapi.TYPE_STRING,
)
update_api_price_param = openapi.Parameter(
    "updateApiPrice",
    openapi.IN_FORM,
    description="Whether to update the companies stock prices from the API or not",
    type=openapi.TYPE_BOOLEAN,
)


class PortfolioStatsGroupedByCompanyAPIView(APIView):

    def get_stats_grouped_by_company(self, portfolio_id, year, update_api_price):
        portfolio_stats = PortfolioStatsUtils(
            portfolio_id, year=year, update_api_price=update_api_price
        )
        stats = portfolio_stats.get_year_stats_by_company()
        logger.debug(f"Stats: {stats}")
        # remove all years that are None
        stats = [stat for stat in stats if stat is not None]
        return CompanyStatsForYearSerializer(stats, many=True).data

    def get(self, request, portfolio_id, year, *args, **kwargs):
        update_api_price = bool(request.query_params.get("updateApiPrice", False))
        stats = self.get_stats_grouped_by_company(portfolio_id, year, update_api_price)
        if not stats:
            return Response(
                {"res": "Stats not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsGroupedByMonthAPIView(APIView):

    def normalize_year(self, year):
        if year == "all":
            return settings.YEAR_FOR_ALL
        return year

    def get_stats_grouped_by_month(self, portfolio_id, year, update_api_price):
        portfolio_stats = PortfolioStatsUtils(
            portfolio_id, year=year, update_api_price=update_api_price
        )
        year = self.normalize_year(year)
        if year == settings.YEAR_FOR_ALL:
            stats = portfolio_stats.get_dividends_for_all_years_monthly()
        else:
            stats = portfolio_stats.get_dividends_for_year_monthly()
        return stats

    def get(self, request, portfolio_id, year, *args, **kwargs):
        update_api_price = bool(request.query_params.get("updateApiPrice", False))
        stats = self.get_stats_grouped_by_month(portfolio_id, year, update_api_price)
        if not stats:
            return Response(
                {"res": "Stats not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsAPIView(APIView):

    def normalize_year(self, year):
        if year == "all":
            return settings.YEAR_FOR_ALL
        return year

    def get_year_stats(self, portfolio_id, year):
        year = self.normalize_year(year)
        portfolio_stats_utils = PortfolioStatsUtils(portfolio_id, year=year)
        stats = portfolio_stats_utils.get_year_stats()
        return PortfolioStatsForYearSerializer(stats).data

    def update_object(
        self, portfolio_id, year, update_api_price=False, companies_ids=[]
    ):
        logger.debug("Updating portfolio stats")
        update_portfolio_stats.delay(
            portfolio_id, companies_ids, year, update_api_price
        )
        return True

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_stats"])
    def get(self, request, portfolio_id, year, *args, **kwargs):
        """
        Retrieve the company item with given id
        """

        stats = self.get_year_stats(portfolio_id, year)
        if not stats:
            return Response(
                {"res": "Stats with id does not exists"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(stats, status=status.HTTP_200_OK)

    # 3. Retrieve
    @swagger_auto_schema(
        tags=["portfolio_stats"],
        manual_parameters=[ids_param, update_api_price_param],
    )
    def put(self, request, portfolio_id, year, *args, **kwargs):
        """
        Update the portfolio item with given id
        """
        update_api_price = request.data.get("update_api_price", False)
        companies_ids = request.query_params.get("companiesIds", "").split(",")
        if companies_ids == [""]:
            companies_ids = []

        stats = self.update_object(
            portfolio_id,
            year,
            update_api_price=update_api_price,
            companies_ids=companies_ids,
        )
        if not stats:
            return Response(
                {"res": "Stats with id does not exists"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(stats, status=status.HTTP_200_OK)


class PortfolioStatsAllYearsAPIView(APIView):
    def get_object(self, portfolio_id):
        try:
            stats = self.get_year_stats(portfolio_id)
            return stats
        except PortfolioStatsForYear.DoesNotExist:
            return None

    def get_year_stats(self, portfolio_id):
        portfolio_stats = PortfolioStatsUtils(portfolio_id, year=settings.YEAR_FOR_ALL)
        stats = portfolio_stats.get_all_years_stats()
        return stats

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_stats"])
    def get(self, request, portfolio_id, *args, **kwargs):
        """
        Retrieve the company item with given id
        """
        stats = self.get_object(portfolio_id)
        if not stats:
            return Response(
                {"res": "Stats with id does not exists"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(stats, status=status.HTTP_200_OK)
