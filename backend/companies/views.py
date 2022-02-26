from django.utils.decorators import method_decorator

from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from companies.serializers import CompanySerializer, CompanySerializerGet
from companies.models import Company
from log_messages.models import LogMessage
from portfolios.models import Portfolio
import logging

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_description="Get a list of company of the current user",
        tags=["companies"],
        responses={200: CompanySerializerGet(many=True)},
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_description="Create a new company for the current user",
        tags=["companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_description="Get an existing company of the current user",
        tags=["companies"],
        responses={200: CompanySerializerGet(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_description="Update an existing company of the current user",
        tags=["companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing company of the current user",
        tags=["companies"],
        responses={200: CompanySerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing company of the current user",
        tags=["companies"],
    ),
)
class CompanyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = CompanySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "company_id"
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        company_id = self.kwargs.get("company_id")
        portfolio_id = self.kwargs.get("portfolio_id")
        if self.action == "list" or self.action == "create":
            return Company.objects.filter(portfolio=portfolio_id, user=user.id)
        return Company.objects.filter(
            id=company_id, portfolio=portfolio_id, user=user.id
        )

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
        if self.action == "list" or self.action == "retrieve":
            return CompanySerializerGet
        return super().get_serializer_class()
