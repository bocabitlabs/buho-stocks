from rest_framework import serializers

from exchange_rates.models import ExchangeRate


class ExchangeRateSerializer(serializers.ModelSerializer):
    exchange_date = serializers.DateField()

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
