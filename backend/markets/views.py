import logging

from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, viewsets
from rest_framework.pagination import LimitOffsetPagination

from markets.models import Market, get_all_timezones
from markets.serializers import MarketSerializer, TimezoneSerializer

logger = logging.getLogger("buho_backend")


class MarketViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing market instances.
    """

    serializer_class = MarketSerializer
    pagination_class = LimitOffsetPagination
    queryset = Market.objects.all()


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_id="timezones_list",
        operation_description="Get all the available timezones",
        tags=["timezones"],
    ),
)
class TimezoneList(generics.ListAPIView):
    serializer_class = TimezoneSerializer

    def get_queryset(self):
        return get_all_timezones()
