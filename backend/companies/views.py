import logging

from django.db.models import OuterRef, Subquery
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from companies.models import Company
from companies.serializers import CompanySerializer, CompanySerializerGet
from log_messages.models import LogMessage
from portfolios.models import Portfolio
from stats.models.company_stats import CompanyStatsForYear

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_id="List portfolio companies",
        operation_description="Get a list of company of a portfolio",
        tags=["Companies"],
        responses={200: CompanySerializerGet(many=True)},
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_id="Create company",
        operation_description="Create a new company in a portfolio",
        tags=["Companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_id="Get company details",
        operation_description="Retrieve details of a company",
        tags=["Companies"],
        responses={200: CompanySerializerGet(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_id="Update a company",
        operation_description="Update an existing company",
        tags=["Companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_id="Patch a company",
        operation_description="Patch an existing company",
        tags=["Companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_id="Delete company",
        operation_description="Delete an existing company",
        tags=["Companies"],
    ),
)
class CompanyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing company instances.
    """

    serializer_class = CompanySerializer
    pagination_class = LimitOffsetPagination
    lookup_url_kwarg = "company_id"
    lookup_field = "id"

    def get_queryset(self):
        company_id = self.kwargs.get("company_id")
        portfolio_id = self.kwargs.get("portfolio_id")
        closed = self.request.query_params.get("closed")

        sort_by = self.request.query_params.get("sort_by", "ticker")
        order_by = self.request.query_params.get("order_by", "asc")

        sort_by_fields = {
            "ticker": "ticker",
            "name": "name",
            "sharesCount": "shares_count",
            "accumulatedInvestment": "accumulated_investment",
            "portfolioValue": "portfolio_value",
            "returnWithDividends": "return_with_dividends",
            "dividendsYield": "dividends_yield",
        }

        if closed == "true":
            closed = True
        else:
            closed = False

        if order_by == "desc":
            order_by = "-"
        else:
            order_by = ""

        global_stats_subquery = (
            CompanyStatsForYear.objects.filter(company=OuterRef("id"), year=9999)
            # .order_by()
            .values(
                "accumulated_investment",
                "shares_count",
                "portfolio_value",
                "return_with_dividends",
                "dividends_yield",
            )
        )

        if self.action == "list" or self.action == "create":
            results = Company.objects.filter(portfolio=portfolio_id, is_closed=closed)
        else:
            results = Company.objects.filter(id=company_id, portfolio=portfolio_id)

        results.annotate(
            accumulated_investment=Subquery(
                global_stats_subquery.values("accumulated_investment")[:1]
            ),
            shares_count=Subquery(global_stats_subquery.values("shares_count")[:1]),
            portfolio_value=Subquery(
                global_stats_subquery.values("portfolio_value")[:1]
            ),
            return_with_dividends=Subquery(
                global_stats_subquery.values("return_with_dividends")[:1]
            ),
            dividends_yield=Subquery(
                global_stats_subquery.values("dividends_yield")[:1]
            ),
        ).order_by(f"{order_by}{sort_by_fields.get(sort_by, 'ticker')}")

        return results

    def perform_create(self, serializer):
        portfolio_id = self.kwargs.get("portfolio_id")
        serializer.save()

        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_CREATE_COMPANY,
            message_text=(
                f"Company created: {serializer.data.get('name')} "
                f"({serializer.data.get('ticker')})"
            ),
            portfolio=Portfolio.objects.get(id=portfolio_id),
        )

    def get_serializer_class(self):
        if self.action == "list":
            return CompanySerializer
        elif self.action == "retrieve":
            return CompanySerializerGet
        return super().get_serializer_class()
