from exchange_rates.models import ExchangeRate
from rest_framework import serializers


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = [
            "exchange_from",
            "exchange_to",
            "exchange_date",
            "exchange_rate",
            "date_created",
            "last_updated",
            "id",
        ]
