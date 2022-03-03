from django.utils.decorators import method_decorator

from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from buho_backend.utils.token_utils import ExpiringTokenAuthentication
from markets.serializers import MarketSerializer
from markets.models import Market
import logging

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_id="Get markets",
        operation_description="Get a list of markets",
        tags=["Markets"],
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_id="Create market",
        operation_description="Create a new market",
        tags=["Markets"],
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_id="Get market details",
        operation_description="Get an existing market",
        tags=["Markets"],
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
                operation_id="Update market",

        operation_description="Update an existing market",
        tags=["Markets"],
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
                operation_id="Patch market",

        operation_description="Patch an existing market",
        tags=["Markets"],
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
                operation_id="Delete market",

        operation_description="Delete an existing market",
        tags=["Markets"],
    ),
)
class MarketViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing market instances.
    """

    serializer_class = MarketSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "market_id"

    def get_queryset(self):
        user = self.request.user
        return Market.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
