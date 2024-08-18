from djmoney.contrib.django_rest_framework import MoneyField
from rest_framework import serializers
from rest_framework.fields import Field

from companies.models import Company
from dividends_transactions.models import DividendsTransaction


class DividendsTransactionSerializer(serializers.ModelSerializer):
    company: Field = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects, many=False, read_only=False
    )

    total_commission = MoneyField(max_digits=12, decimal_places=3)
    total_commission_currency = serializers.CharField(max_length=50)

    notes = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = DividendsTransaction
        fields = [
            "id",
            "count",
            "exchange_rate",
            "transaction_date",
            "total_commission",
            "total_commission_currency",
            "total_amount",
            "total_amount_currency",
            "company",
            "notes",
            "date_created",
            "last_updated",
        ]
