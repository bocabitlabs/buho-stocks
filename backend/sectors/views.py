import logging
from django.utils.decorators import method_decorator
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from buho_backend.utils.token_utils import ExpiringTokenAuthentication
from sectors.serializers import (
    SectorSerializer,
    SectorSerializerGet,
    SuperSectorSerializer,
)
from sectors.models import Sector, SuperSector

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_description="Get a list of sectors of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=True)},
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_description="Create a new sector for the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_description="Get an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_description="Update an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing sector of the current user",
        tags=["sectors"],
    ),
)
class SectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SectorSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        user = self.request.user
        return Sector.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return SectorSerializerGet
        return (
            super().get_serializer_class()
        )


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_description="Get a list of super_sector of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializerGet(many=True)},
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_description="Create a new super_sector for the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_description="Get an existing super_sector of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializerGet(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_description="Update an existing super_sector of the current user",
        tags=["super_sectors"],
        responses={200: SuperSectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing super_sector of the current user",
        tags=["super_sectors"],
        responses={200: SuperSectorSerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing super_sectors of the current user",
        tags=["super_sectors"],
    ),
)
class SuperSectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SuperSectorSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        user = self.request.user
        return SuperSector.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
