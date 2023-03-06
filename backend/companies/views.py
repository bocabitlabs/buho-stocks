import logging

from companies.models import Company
from companies.serializers import CompanySerializer, CompanySerializerGet
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from log_messages.models import LogMessage
from portfolios.models import Portfolio
from rest_framework import viewsets

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
        operation_description="Patch an existing company of the current user",
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
    lookup_url_kwarg = "company_id"
    lookup_field = "id"

    def get_queryset(self):
        company_id = self.kwargs.get("company_id")
        portfolio_id = self.kwargs.get("portfolio_id")
        closed = self.request.query_params.get("closed")

        if closed == "true":
            closed = True
        else:
            closed = False

        if self.action == "list" or self.action == "create":
            return Company.objects.filter(portfolio=portfolio_id, is_closed=closed)

        return Company.objects.filter(id=company_id, portfolio=portfolio_id)

    def perform_create(self, serializer):
        portfolio_id = self.kwargs.get("portfolio_id")
        serializer.save(user=self.request.user)

        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_CREATE_COMPANY,
            message_text=f"Company created: {serializer.data.get('name')} ({serializer.data.get('ticker')})",
            portfolio=Portfolio.objects.get(id=portfolio_id),
            user=self.request.user,
        )

    def get_serializer_class(self):
        if self.action == "list":
            return CompanySerializer
        elif self.action == "retrieve":
            return CompanySerializerGet
        return super().get_serializer_class()
