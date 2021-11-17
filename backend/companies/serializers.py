from portfolios.models import Portfolio
from rest_framework import serializers
from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from companies.models import Company
from sectors.models import Sector
from markets.models import Market
from markets.serializers import MarketSerializer
from sectors.serializers import SectorSerializer
import shares_transactions
from shares_transactions.serializers import SharesTransactionSerializer


class CompanySerializer(serializers.ModelSerializer):
    currency = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), many=False, read_only=False
    )
    dividends_currency = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), many=False, read_only=False
    )
    sector = serializers.PrimaryKeyRelatedField(
        queryset=Sector.objects.all(), many=False, read_only=False
    )
    market = serializers.PrimaryKeyRelatedField(
        queryset=Market.objects.all(), many=False, read_only=False
    )
    portfolio = serializers.PrimaryKeyRelatedField(
        queryset=Portfolio.objects.all(), many=False, read_only=False
    )
    shares_transactions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "description",
            "color",
            "currency",
            "dividends_currency",
            "market",
            "sector",
            "portfolio",
            "shares_transactions",
            "date_created",
            "last_updated",
        ]


class CompanySerializerGet(CompanySerializer):
    dividends_currency = CurrencySerializer(many=False, read_only=True)
    currency = CurrencySerializer(many=False, read_only=True)
    market = MarketSerializer(many=False, read_only=True)
    sector = SectorSerializer(many=False, read_only=True)
    shares_transactions = SharesTransactionSerializer(many=True, read_only=True)
