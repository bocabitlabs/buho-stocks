from portfolios.models import Portfolio
from rest_framework import serializers
from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from companies.models import Company
from shares_transactions.models import SharesTransaction


class SharesTransactionSerializer(serializers.ModelSerializer):

    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = SharesTransaction
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
