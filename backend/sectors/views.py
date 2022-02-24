import logging
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from sectors.serializers import (
    SectorSerializer,
    SectorSerializerGet,
    SuperSectorSerializer,
)
from sectors.models import Sector, SuperSector

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get a list of sectors of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=True)},
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_description="Create a new sector for the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
class SectorListCreateAPIView(generics.ListCreateAPIView):
    """Get all the sectors from a user"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Sector.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        logger.debug(self.request.method)
        if self.request.method == "GET":
            return SectorSerializerGet
        if self.request.method == "POST":
            return SectorSerializer
        return (
            super().get_serializer_class()
        )


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=False)},
    ),
)
@method_decorator(
    name="put",
    decorator=swagger_auto_schema(
        operation_description="Update an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="patch",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="delete",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing sector of the current user",
        tags=["sectors"],
    ),
)
class SectorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = SectorSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        user = self.request.user
        return Sector.objects.filter(user=user.id)

@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get a list of super sectors of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializerGet(many=True)},
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_description="Create a new super sector for the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
class SuperSectorListCreateAPIView(generics.ListCreateAPIView):
    """Get all the super sectors from a user"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SuperSectorSerializer

    def get_queryset(self):
        user = self.request.user
        return SuperSector.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=False)},
    ),
)
@method_decorator(
    name="put",
    decorator=swagger_auto_schema(
        operation_description="Update an existing super sector of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="patch",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing super sector of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="delete",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing super sector of the current user",
        tags=["super_sectors"],
    ),
)
class SuperSectorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = SuperSectorSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        user = self.request.user
        return SuperSector.objects.filter(user=user.id)
