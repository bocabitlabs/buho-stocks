from sectors.models import Sector, SuperSector
from rest_framework import serializers


class SectorSerializer(serializers.ModelSerializer):
    super_sector = serializers.PrimaryKeyRelatedField(
        queryset=SuperSector.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Sector
        fields = ["name", "color", "date_created", "last_updated", "id", "super_sector"]


class SuperSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuperSector
        fields = ["name", "color", "date_created", "last_updated", "id"]


class SectorSerializerGet(SectorSerializer):
    super_sector = SuperSectorSerializer(many=False, read_only=True)
