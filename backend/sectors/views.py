import logging

from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination

from sectors.models import Sector, SuperSector
from sectors.serializers import (
    SectorSerializer,
    SectorSerializerGet,
    SuperSectorSerializer,
)

logger = logging.getLogger("buho_backend")


class SectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SectorSerializer
    pagination_class = LimitOffsetPagination
    queryset = Sector.objects.all()

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return SectorSerializerGet
        return super().get_serializer_class()


class SuperSectorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing sector instances.
    """

    serializer_class = SuperSectorSerializer
    pagination_class = LimitOffsetPagination
    queryset = SuperSector.objects.all()
