from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers

from companies.models import Company
from shares_transactions.models import SharesTransaction


class SharesTransactionSerializer(serializers.ModelSerializer[SharesTransaction]):
    company: serializers.PrimaryKeyRelatedField = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects,
        many=False,
        read_only=False,
    )
    total_amount = MoneyField(max_digits=12, decimal_places=3)
    total_amount_currency = serializers.CharField(max_length=50)

    total_commission = MoneyField(max_digits=12, decimal_places=3)
    total_commission_currency = serializers.CharField(max_length=50)

    notes = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = SharesTransaction
        fields = [
            "id",
            "count",
            "exchange_rate",
            "transaction_date",
            "type",
            "total_amount",
            "total_amount_currency",
            "total_commission",
            "total_commission_currency",
            "company",
            "notes",
            "date_created",
            "last_updated",
        ]
