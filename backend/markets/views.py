from django.utils.decorators import method_decorator

from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from drf_yasg.utils import swagger_auto_schema
from markets.serializers import MarketSerializer
from markets.models import Market
import logging

logger = logging.getLogger("buho_backend")

@method_decorator(name='get', decorator=swagger_auto_schema(
    operation_description="Get a list of markets of the current user",
    tags=["markets"]
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    operation_description="Create a new market for the current user",
    tags=["markets"]
))
class MarketListCreateAPIView(generics.ListCreateAPIView):
    """Get all the markets from a user"""

    serializer_class = MarketSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Market.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@method_decorator(name='get', decorator=swagger_auto_schema(
    operation_description="Get an existing market of the current user",
    tags=["markets"]
))
@method_decorator(name='put', decorator=swagger_auto_schema(
    operation_description="Update an existing market of the current user",
    tags=["markets"]
))
@method_decorator(name='patch', decorator=swagger_auto_schema(
    operation_description="Patch an existing market of the current user",
    tags=["markets"]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    operation_description="Delete an existing market of the current user",
    tags=["markets"]
))
class MarketDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = MarketSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'market_id'

    def get_queryset(self):
        user = self.request.user
        return Market.objects.filter(user=user.id)
