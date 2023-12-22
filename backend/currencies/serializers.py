from currencies.models import Currency
from rest_framework import serializers


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ["name", "code", "symbol", "id"]
