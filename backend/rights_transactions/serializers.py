from companies.models import Company
from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers
from rights_transactions.models import RightsTransaction


class RightsTransactionSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects, many=False, read_only=False)
    gross_price_per_share = MoneyField(max_digits=12, decimal_places=3)
    gross_price_per_share_currency = serializers.CharField(max_length=50)

    total_commission = MoneyField(max_digits=12, decimal_places=3)
    total_commission_currency = serializers.CharField(max_length=50)

    notes = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = RightsTransaction
        fields = [
            "id",
            "count",
            "exchange_rate",
            "transaction_date",
            "type",
            "gross_price_per_share",
            "gross_price_per_share_currency",
            "total_commission",
            "total_commission_currency",
            "company",
            "notes",
            "date_created",
            "last_updated",
        ]
