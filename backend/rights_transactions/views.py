import logging
from datetime import datetime

from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from rest_framework import viewsets

from companies.models import Company
from log_messages.models import LogMessage
from rights_transactions.models import RightsTransaction
from rights_transactions.serializers import RightsTransactionSerializer
from stats.tasks import update_portolfio_stats

logger = logging.getLogger("buho_backend")

update_portfolio_param = openapi.Parameter(
    "updatePortfolio",
    openapi.IN_FORM,
    description="Whether or not to update the portfolio stats after adding the dividend",
    type=openapi.TYPE_BOOLEAN,
)


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

        update_portfolio = self.request.data.get("updatePortfolio", False)
        if update_portfolio:
            update_portolfio_stats.delay(company.portfolio_id, [company.id], transaction_date.year)

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
