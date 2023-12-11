import logging
from datetime import datetime

from companies.models import Company
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from log_messages.models import LogMessage
from rest_framework import viewsets
from shares_transactions.models import SharesTransaction
from shares_transactions.serializers import SharesTransactionSerializer
from stats.tasks import update_portolfio_stats

logger = logging.getLogger("buho_backend")

update_portfolio_param = openapi.Parameter(
    "updatePortfolio",
    openapi.IN_FORM,
    description="Whether or not to update the portfolio stats after adding the dividend",
    type=openapi.TYPE_BOOLEAN,
)


class SharesViewSet(viewsets.ModelViewSet):
    """CRUD operations for shares transactions"""

    serializer_class = SharesTransactionSerializer
    queryset = SharesTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["company"]

    def perform_create(self, serializer):
        serializer.save()
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        self.add_shares_update_company_stats(serializer, company)
        self.create_add_shares_log_message(serializer, company)

    def add_shares_update_company_stats(self, serializer, company):
        logger.debug(f"Updating company stats for {company.name} after adding shares")
        transaction_date = datetime.strptime(serializer.data.get("transaction_date"), "%Y-%m-%d")

        update_portfolio = self.request.data.get("updatePortfolio", False)
        if update_portfolio:
            update_portolfio_stats.delay(company.portfolio_id, [company.id], transaction_date.year)

    def create_add_shares_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_SHARES,
            message_text=(
                f"Shares added: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - {serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. {serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )
