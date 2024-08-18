import logging
from datetime import datetime

from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from companies.models import Company
from log_messages.models import LogMessage
from shares_transactions.models import SharesTransaction
from shares_transactions.serializers import SharesTransactionSerializer
from stats.tasks import update_portfolio_stats

logger = logging.getLogger("buho_backend")

update_portfolio_desc = (
    "Whether or not to update the portfolio stats after adding the dividend"
)
update_portfolio_param = openapi.Parameter(
    "updatePortfolio",
    openapi.IN_FORM,
    description=update_portfolio_desc,
    type=openapi.TYPE_BOOLEAN,
)


class SharesViewSet(viewsets.ModelViewSet):
    """CRUD operations for shares transactions"""

    serializer_class = SharesTransactionSerializer
    pagination_class = LimitOffsetPagination
    queryset = SharesTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["company"]

    def perform_create(self, serializer):
        super().perform_create(serializer)
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        self.add_shares_update_company_stats(serializer, company)
        self.create_add_shares_log_message(serializer, company)

    def perform_update(self, serializer):
        super().perform_update(serializer)
        # Log the operation
        company = Company.objects.get(id=serializer.data["company"])
        self.add_shares_update_company_stats(serializer, company)
        self.create_add_shares_log_message(serializer, company)

    def perform_destroy(self, instance):
        company = Company.objects.get(id=instance.company.id)
        super().perform_destroy(instance)
        self.create_delete_shares_log_message(instance, company)
        self.add_shares_update_company_stats(instance, company)

    def add_shares_update_company_stats(self, serializer, company):
        logger.debug(f"Updating company stats for {company.name} after adding shares")
        transaction_date = datetime.strptime(
            serializer.data.get("transaction_date"), "%Y-%m-%d"
        )
        update_portfolio = self.request.query_params.get("updatePortfolio", False)
        if update_portfolio == "true":
            update_portfolio_stats.delay(
                company.portfolio_id, [company.id], transaction_date.year
            )

    def create_add_shares_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_SHARES,
            message_text=(
                f"Shares added: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - "
                f"{serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. "
                f"{serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )

    def create_update_shares_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_UPDATE_SHARES,
            message_text=(
                f"Shares updated: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - "
                f"{serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. "
                f"{serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )

    def create_delete_shares_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_DELETE_SHARES,
            message_text=(f"Shares deleted: {company.name} ({company.ticker}). "),
            portfolio=company.portfolio,
        )
