from rest_framework.fields import SerializerMethodField
from rest_framework import serializers

from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from buho_backend.validators import validate_ownership
from currencies.models import get_currency_details
from dividends_transactions.serializers import DividendsTransactionSerializer
from portfolios.models import Portfolio
from companies.models import Company
from portfolios.serializers_lite import PortfolioSerializerLite
from rights_transactions.serializers import RightsTransactionSerializer
from sectors.models import Sector
from sectors.serializers import SectorSerializerGet
from markets.models import Market
from markets.serializers import MarketSerializer
from shares_transactions.serializers import SharesTransactionSerializer
from drf_extra_fields.fields import Base64ImageField

from stats.serializers import CompanyStatsForYearSerializer

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
    logo = Base64ImageField(max_length=None, use_url=True, allow_null = True, required=False)
    stats = CompanyStatsForYearSerializer(many=True, read_only=True)


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
            "logo",
            "market",
            "name",
            "portfolio",
            "rights_transactions",
            "sector",
            "shares_transactions",
            "ticker",
            "url",
            "stats",
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
    base_currency = SerializerMethodField()
    dividends_currency = SerializerMethodField()

    market = MarketSerializer(many=False, read_only=True)
    sector = SectorSerializerGet(many=False, read_only=True)
    shares_transactions = SharesTransactionSerializer(many=True, read_only=True)
    rights_transactions = RightsTransactionSerializer(many=True, read_only=True)
    dividends_transactions = DividendsTransactionSerializer(many=True, read_only=True)
    portfolio = PortfolioSerializerLite(many=False, read_only=True)

    def get_base_currency(self, obj):
        return get_currency_details(
            obj.base_currency
        )  # access the price of the product associated with the order_unit object

    def get_dividends_currency(self, obj):
        return get_currency_details(
            obj.dividends_currency
        )  # access the price of the product associated with the order_unit object

    def get_logo(self, obj):
        request = self.context.get('request')
        photo_url = obj.fingerprint.url
        return request.build_absolute_uri(photo_url)
