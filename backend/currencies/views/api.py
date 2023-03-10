import logging

from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_id="Get currencies",
        operation_description="Get a list of currencies",
        tags=["Currencies"],
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_id="Get currency details",
        operation_description="Get an existing currency",
        tags=["Currencies"],
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_id="Create a currency",
        operation_description="Create a new currency",
        tags=["Currencies"],
        responses={200: CurrencySerializer(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_id="Update a currency",
        operation_description="Update an existing currency",
        tags=["Currencies"],
        responses={200: CurrencySerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_id="Patch a currency",
        operation_description="Patch an existing currency",
        tags=["Currencies"],
        responses={200: CurrencySerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_id="Delete currency",
        operation_description="Delete an existing currency",
        tags=["Currencies"],
    ),
)
class CurrencyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing currency instances.
    """

    serializer_class = CurrencySerializer
    lookup_url_kwarg = "currency_id"

    def get_queryset(self):
        return Currency.objects.all()
