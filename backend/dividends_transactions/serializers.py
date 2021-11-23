from rest_framework import serializers
from companies.models import Company
from dividends_transactions.models import DividendsTransaction


class DividendsTransactionSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = DividendsTransaction
        fields = [
            "id",
            "name",
            "count",
            "color",
            "exchange_rate",
            "transaction_date",
            "type",
            "price_per_share",
            "total_commission",
            "company",
            "notes",
            "date_created",
            "last_updated",
        ]
