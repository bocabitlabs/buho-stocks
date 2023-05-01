import logging
from datetime import datetime

from companies.models import Company
from django_filters.rest_framework import DjangoFilterBackend
from log_messages.models import LogMessage
from rest_framework import viewsets
from rights_transactions.models import RightsTransaction
from rights_transactions.serializers import RightsTransactionSerializer
from stats.utils.company_stats_utils import CompanyStatsUtils

logger = logging.getLogger("buho_backend")


class RightsViewSet(viewsets.ModelViewSet):
    """CRUD operations for rights transactions"""

    serializer_class = RightsTransactionSerializer
    queryset = RightsTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["company"]

    def perform_create(self, serializer):
        serializer.save()
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        self.create_add_rights_log_message(serializer, company)
        self.add_rights_update_company_stats(serializer, company)

    def add_rights_update_company_stats(self, serializer, company):
        logger.debug(f"Updating company stats for {company.name} after adding rights")
        transaction_date = datetime.strptime(serializer.data.get("transaction_date"), "%Y-%m-%d")
        company_stats = CompanyStatsUtils(company.id, year=transaction_date.year, update_api_price=True)
        company_stats.get_stats_for_year()

    def create_add_rights_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_RIGHTS,
            message_text=(
                f"Rights added: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - {serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. {serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )
