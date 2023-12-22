from rest_framework import serializers

from sectors.models import Sector, SuperSector


class SectorSerializer(serializers.ModelSerializer):
    super_sector = serializers.PrimaryKeyRelatedField(
        queryset=SuperSector.objects,
        many=False,
        read_only=False,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Sector
        fields = ["name", "date_created", "last_updated", "id", "super_sector"]


class SuperSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuperSector
        fields = ["name", "date_created", "last_updated", "id"]


class SectorSerializerGet(SectorSerializer):
    super_sector = SuperSectorSerializer(many=False, read_only=True)
