from rest_framework import serializers
from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from buho_backend.validators import validate_ownership
from companies.models import Company
from stock_prices.models import StockPrice


class StockPriceSerializer(serializers.ModelSerializer):
    price_currency = serializers.CharField(max_length=50)

    class Meta:
        model = StockPrice
        fields = [
            "id",
            "transaction_date",
            "price",
            "price_currency",
            "ticker",
            "date_created",
            "last_updated",
        ]
