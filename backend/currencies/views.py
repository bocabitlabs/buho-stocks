from django.utils.decorators import method_decorator
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from drf_yasg.utils import swagger_auto_schema
from buho_backend.utils.token_utils import ExpiringTokenAuthentication

from currencies.models import get_all_currencies
from currencies.serializers import CurrencySerializer


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_id="Get all currencies",
        operation_description="Get all the available currencies",
        tags=["Currencies"],
    ),
)
class CurrencyList(generics.ListAPIView):
    queryset = get_all_currencies()
    serializer_class = CurrencySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [ExpiringTokenAuthentication]
