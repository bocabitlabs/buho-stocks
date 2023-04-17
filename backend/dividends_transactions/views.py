from companies.models import Company
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.serializers import DividendsTransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from log_messages.models import LogMessage
from rest_framework import viewsets


class DividendsViewSet(viewsets.ModelViewSet):
    """CRUD operations for dividends transactions"""

    serializer_class = DividendsTransactionSerializer
    queryset = DividendsTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["company"]

    def perform_create(self, serializer):
        serializer.save()
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_DIVIDEND,
            message_text=(
                f"Dividend added: {company.name} ({company.ticker}). Amount: "
                f"{serializer.data.get('total_amount')}. {serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )
