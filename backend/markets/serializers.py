from rest_framework import serializers

from markets.models import Market


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = [
            "name",
            "description",
            "region",
            "open_time",
            "close_time",
            "timezone",
            "date_created",
            "last_updated",
            "id",
        ]


class TimezoneSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
