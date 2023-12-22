import logging

from rest_framework import viewsets

from currencies.models import Currency
from currencies.serializers import CurrencySerializer

logger = logging.getLogger("buho_backend")


class CurrencyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing currency instances.
    """

    serializer_class = CurrencySerializer
    queryset = Currency.objects.all()
