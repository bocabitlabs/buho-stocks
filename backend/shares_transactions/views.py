from companies.models import Company
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from log_messages.models import LogMessage
from rest_framework import generics
from shares_transactions.models import SharesTransaction
from shares_transactions.serializers import SharesTransactionSerializer


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_id="List shares transactions",
        operation_description="Get a list of shares transactions of the current company",
        tags=["Shares"],
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_id="Create shares transaction",
        operation_description="Create a new shares transaction for the current company",
        tags=["Shares"],
    ),
)
class SharesTransactionListCreateAPIView(generics.ListCreateAPIView):
    """Get all the shares transactions from a company"""

    serializer_class = SharesTransactionSerializer

    def get_queryset(self):
        company_id = self.kwargs.get("company_id")
        return SharesTransaction.objects.filter(company=company_id)

    def perform_create(self, serializer):
        serializer.save()
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_SHARES,
            message_text=(
                f"Shares added: {company.name} ({company.ticker}). "
                f"{serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. {serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_id="Retrieve shares transaction",
        operation_description="Get an existing shares transaction of the current user",
        tags=["Shares"],
    ),
)
@method_decorator(
    name="put",
    decorator=swagger_auto_schema(
        operation_id="Update shares transaction",
        operation_description="Update an existing shares transaction of the current user",
        tags=["Shares"],
    ),
)
@method_decorator(
    name="patch",
    decorator=swagger_auto_schema(
        operation_id="Patch shares transaction",
        operation_description="Patch an existing shares transaction of the current user",
        tags=["Shares"],
    ),
)
@method_decorator(
    name="delete",
    decorator=swagger_auto_schema(
        operation_id="Delete shares transaction",
        operation_description="Delete an existing shares transaction of the current user",
        tags=["Shares"],
    ),
)
class SharesTransactionDetailsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SharesTransactionSerializer
    lookup_url_kwarg = "transaction_id"

    def get_queryset(self):
        transaction_id = self.kwargs.get("transaction_id")
        return SharesTransaction.objects.filter(id=transaction_id)
