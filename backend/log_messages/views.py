import logging

from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from log_messages.models import LogMessage
from log_messages.serializers import LogMessageSerializer

logger = logging.getLogger("buho_backend")


class LogMessageViewSet(viewsets.ModelViewSet):

    pagination_class = LimitOffsetPagination
    serializer_class = LogMessageSerializer
    queryset = LogMessage.objects.all()
    lookup_field = "id"

    def get_queryset(self):
        portfolio_id = self.kwargs.get("portfolio_id")
        recent_messages = LogMessage.objects.filter(portfolio=portfolio_id).order_by(
            "-date_created"
        )
        return recent_messages
