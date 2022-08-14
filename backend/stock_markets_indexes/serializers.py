from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField

from stock_markets_indexes.models import StockMarketIndex, StockMarketIndexYear


class StockMarketIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMarketIndex
        fields = [
            "id",
            "name",
            "date_created",
            "last_updated",
        ]


class StockMarketIndexYearSerializer(serializers.ModelSerializer):

    value = MoneyField(max_digits=12, decimal_places=3)
    value_currency = serializers.CharField(max_length=50)

    class Meta:
        model = StockMarketIndexYear
        fields = [
            "id",
            "year",
            "index",
            "value",
            "return_percentage",
            "value_currency",
            "date_created",
            "last_updated",
        ]
