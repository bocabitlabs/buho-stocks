import logging
from datetime import datetime

from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from companies.models import Company
from log_messages.models import LogMessage
from rights_transactions.models import RightsTransaction
from rights_transactions.serializers import RightsTransactionSerializer
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


class RightsViewSet(viewsets.ModelViewSet):
    """CRUD operations for rights transactions"""

    serializer_class = RightsTransactionSerializer
    pagination_class = LimitOffsetPagination
    queryset = RightsTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["company"]

    def perform_create(self, serializer):

        super().perform_create(serializer)

        company = Company.objects.get(id=serializer.data["company"])
        self.create_add_rights_log_message(serializer, company)
        self.add_rights_update_company_stats(serializer, company)

    def perform_update(self, serializer):
        super().perform_update(serializer)

        company = Company.objects.get(id=serializer.data["company"])
        self.create_update_rights_log_message(serializer, company)
        self.add_rights_update_company_stats(serializer, company)

    def perform_destroy(self, instance):
        company = Company.objects.get(id=instance.company.id)
        super().perform_destroy(instance)
        self.create_delete_rights_log_message(instance, company)
        self.add_rights_update_company_stats(instance, company)

    def add_rights_update_company_stats(self, serializer, company):
        logger.debug(f"Updating company stats for {company.name} after adding rights")
        transaction_date = datetime.strptime(
            serializer.data.get("transaction_date"), "%Y-%m-%d"
        )

        update_portfolio = self.request.query_params.get("updatePortfolio", False)
        if update_portfolio == "true":
            update_portfolio_stats.delay(
                company.portfolio_id, [company.id], transaction_date.year
            )

    def create_add_rights_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_ADD_RIGHTS,
            message_text=(
                f"Rights added: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - "
                f"{serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. "
                f"{serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )

    def create_update_rights_log_message(self, serializer, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_UPDATE_RIGHTS,
            message_text=(
                f"Rights updated: {company.name} ({company.ticker}). "
                f"Total: {serializer.data.get('total_amount')} - "
                f"{serializer.data.get('count')} - "
                f"{serializer.data.get('gross_price_per_share')}. "
                f"{serializer.data.get('notes')}"
            ),
            portfolio=company.portfolio,
        )

    def create_delete_rights_log_message(self, instance, company):
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_DELETE_RIGHTS,
            message_text=(f"Rights deleted: {company.name} ({company.ticker})."),
            portfolio=company.portfolio,
        )
