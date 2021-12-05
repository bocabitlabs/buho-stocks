from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from buho_backend.validators import validate_ownership
from currencies.serializers import CurrencySerializer
from dividends_transactions.serializers import DividendsTransactionSerializer
from portfolios.models import Portfolio
from rest_framework import serializers
from companies.models import Company
from rights_transactions.serializers import RightsTransactionSerializer
from sectors.models import Sector
from sectors.serializers import SectorSerializer
from markets.models import Market
from markets.serializers import MarketSerializer
from shares_transactions.serializers import SharesTransactionSerializer


class CompanySerializer(serializers.ModelSerializer):
    sector = UserFilteredPrimaryKeyRelatedField(
        queryset=Sector.objects, many=False, read_only=False
    )
    market = UserFilteredPrimaryKeyRelatedField(
        queryset=Market.objects, many=False, read_only=False
    )
    portfolio = UserFilteredPrimaryKeyRelatedField(
        queryset=Portfolio.objects, many=False, read_only=False
    )
    shares_transactions = UserFilteredPrimaryKeyRelatedField(many=True, read_only=True)
    rights_transactions = UserFilteredPrimaryKeyRelatedField(many=True, read_only=True)
    dividends_transactions = UserFilteredPrimaryKeyRelatedField(
        many=True, read_only=True
    )

    class Meta:
        model = Company
        fields = [
            "id",
            "alt_tickers",
            "base_currency",
            "broker",
            "color",
            "country_code",
            "description",
            "dividends_currency",
            "dividends_transactions",
            "market",
            "name",
            "portfolio",
            "rights_transactions",
            "sector",
            "shares_transactions",
            "ticker",
            "url",
            "date_created",
            "last_updated",
        ]

    def validate(self, attrs):
        market = attrs["market"]
        portfolio = attrs["portfolio"]
        sector = attrs["sector"]

        validate_ownership(self.context, market, Market)
        validate_ownership(self.context, portfolio, Portfolio)
        validate_ownership(self.context, sector, Sector)
        return attrs


class CompanySerializerGet(CompanySerializer):
    base_currency = CurrencySerializer(many=False, read_only=True)
    dividends_currency = CurrencySerializer(many=False, read_only=True)

    market = MarketSerializer(many=False, read_only=True)
    sector = SectorSerializer(many=False, read_only=True)
    shares_transactions = SharesTransactionSerializer(many=True, read_only=True)
    rights_transactions = RightsTransactionSerializer(many=True, read_only=True)
    dividends_transactions = DividendsTransactionSerializer(many=True, read_only=True)
