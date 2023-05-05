import logging
from datetime import datetime

from companies.models import Company
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.serializers import DividendsTransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from log_messages.models import LogMessage
from rest_framework import viewsets
from stats.utils.company_stats_utils import CompanyStatsUtils

logger = logging.getLogger("buho_backend")


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
        self.create_add_dividends_log_message(serializer, company)
        self.add_dividends_update_company_stats(serializer, company)

    def add_dividends_update_company_stats(self, serializer, company):
        logger.debug(f"Updating company stats for {company.name} after adding dividend")
        transaction_date = datetime.strptime(serializer.data.get("transaction_date"), "%Y-%m-%d")
        company_stats = CompanyStatsUtils(company.id, year=transaction_date.year, update_api_price=True)
        company_stats.get_stats_for_year()

    def create_add_dividends_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_DIVIDEND,
            message_text=(
                f"Dividend added: {company.name} ({company.ticker}). Amount: "
                f"{serializer.data.get('total_amount')}. {serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )
