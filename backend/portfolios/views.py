from django.utils.decorators import method_decorator
from rest_framework import generics

from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from portfolios.serializers import PortfolioSerializer, PortfolioSerializerGet
from portfolios.models import Portfolio

@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get a list of portfolios of the current user",
        tags=["portfolios"],
        responses={200: PortfolioSerializerGet(many=True)},
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_description="Create a new portfolio for the current user",
        tags=["portfolios"],
        responses={200: PortfolioSerializer(many=False)},
    ),
)
class PortfolioListCreateAPIView(generics.ListCreateAPIView):
    """Get all the portfolios from a user"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PortfolioSerializerGet
        if self.request.method == "POST":
            return PortfolioSerializer
        return (
            super().get_serializer_class()
        )

@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get an existing portfolio of the current user",
        tags=["portfolios"],
        responses={200: PortfolioSerializerGet(many=False)},
    ),
)
@method_decorator(
    name="put",
    decorator=swagger_auto_schema(
        operation_description="Update an existing portfolio of the current user",
        tags=["portfolios"],
        responses={200: PortfolioSerializer(many=False)},
    ),
)
@method_decorator(
    name="patch",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing portfolio of the current user",
        tags=["portfolios"],
        responses={200: PortfolioSerializer(many=False)},
    ),
)
@method_decorator(
    name="delete",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing portfolio of the current user",
        tags=["portfolios"],
    ),
)
class PortfolioDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = PortfolioSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "portfolio_id"

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user.id)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PortfolioSerializerGet
        return (
            super().get_serializer_class()
        )
