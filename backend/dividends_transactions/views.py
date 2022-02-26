from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from companies.models import Company
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.serializers import DividendsTransactionSerializer
from log_messages.models import LogMessage

@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get a list of portfolios of the current user",
        tags=["company_dividends"],
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_description="Create a new portfolio for the current user",
        tags=["company_dividends"],
    ),
)
class DividendsTransactionListCreateAPIView(generics.ListCreateAPIView):
    """Get all the portfolios from a user"""

    serializer_class = DividendsTransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DividendsTransaction.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Log the operation
        company = Company.objects.get(id=serializer.data['company'])
        LogMessage.objects.create(
                message_type=LogMessage.MESSAGE_TYPE_ADD_DIVIDEND,
                message_text=f"Dividend added: {company.name} ({company.ticker}). {serializer.data.get('count')} - {serializer.data.get('gross_price_per_share')}. {serializer.data.get('notes')}",
                portfolio=company.portfolio,
                user=self.request.user,
            )

@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get an existing dividends transaction of the current user",
        tags=["company_dividends"],
    ),
)
@method_decorator(
    name="put",
    decorator=swagger_auto_schema(
        operation_description="Update an existing dividends transaction of the current user",
        tags=["company_dividends"],
    ),
)
@method_decorator(
    name="patch",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing dividends transaction of the current user",
        tags=["company_dividends"],
    ),
)
@method_decorator(
    name="delete",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing dividends transaction of the current user",
        tags=["company_dividends"],
    ),
)
class DividendsDetailsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = DividendsTransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "transaction_id"

    def get_queryset(self):
        transaction_id = self.kwargs.get("transaction_id")
        user = self.request.user
        return DividendsTransaction.objects.filter(id=transaction_id, user=user.id)
