import logging
from django.utils.decorators import method_decorator
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from buho_backend.utils.token_utils import ExpiringTokenAuthentication
from sectors.serializers import (
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
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_description="Get an existing sector of the current user",
        tags=["sectors"],
        responses={200: SectorSerializerGet(many=False)},
    ),
)
class SectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SectorSerializerGet
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        return Sector.objects.all()


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_description="Get a list of super_sector of the current user",
        tags=["super_sectors"],
        responses={200: SectorSerializerGet(many=True)},
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
class SuperSectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SuperSectorSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "sector_id"

    def get_queryset(self):
        return SuperSector.objects.all()
