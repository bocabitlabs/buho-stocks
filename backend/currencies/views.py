import logging

from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from currencies.models import Currency
from currencies.serializers import CurrencySerializer

logger = logging.getLogger("buho_backend")


class CurrencyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing currency instances.
    """

    serializer_class = CurrencySerializer
    pagination_class = LimitOffsetPagination
    queryset = Currency.objects.all()
