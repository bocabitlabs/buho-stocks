from rest_framework import serializers

from companies.models import Company
from markets.serializers import MarketSerializer
from sectors.serializers import SectorSerializerGet


class CompanySerializerLite(serializers.ModelSerializer):
    market = MarketSerializer(many=False, read_only=True)
    sector = SectorSerializerGet(many=False, read_only=True)

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "ticker",
            "base_currency",
            "dividends_currency",
            "market",
            "sector",
        ]
