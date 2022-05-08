from rest_framework.fields import SerializerMethodField
from rest_framework import serializers
from dividends_transactions.models import DividendsTransaction

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
from shares_transactions.models import SharesTransaction
from drf_extra_fields.fields import Base64ImageField
from stats.models.company_stats import CompanyStatsForYear
from stats.serializers.company_stats import CompanyStatsForYearSerializer
import logging

logger = logging.getLogger("buho_backend")

class FilteredCompanySerializer(serializers.ListSerializer):
    def to_representation(self, data):
        # qry_exam = self.context['request'].GET.get('exam')
        data = data.filter(is_closed=False)
        return super(FilteredCompanySerializer,  self).to_representation(data)

class CompanySerializer(serializers.ModelSerializer):
    market = UserFilteredPrimaryKeyRelatedField(queryset=Market.objects, many=False, read_only=False)
    sector = UserFilteredPrimaryKeyRelatedField(queryset=Sector.objects,many=False, read_only=False)
    portfolio = UserFilteredPrimaryKeyRelatedField(
        queryset=Portfolio.objects, many=False, read_only=False
    )

    logo = Base64ImageField(max_length=None, use_url=True, allow_null = True, required=False)
    all_stats = serializers.SerializerMethodField()
    last_transaction_month = serializers.SerializerMethodField()
    last_dividend_month = serializers.SerializerMethodField()
    sector_name = serializers.CharField(source='sector.name', read_only=True)


    class Meta:
        model = Company
        list_serializer_class = FilteredCompanySerializer
        fields = [
            "id",
            "alt_tickers",
            "base_currency",
            "broker",
            "color",
            "country_code",
            "description",
            "dividends_currency",
            "is_closed",
            'isin',
            "logo",
            "market",
            "name",
            "portfolio",
            "sector",
            "sector_name",
            "ticker",
            "url",
            "all_stats",
            "date_created",
            "last_updated",
            "last_transaction_month",
            "last_dividend_month",
        ]

    def validate(self, attrs):
        market = attrs["market"]
        portfolio = attrs["portfolio"]
        sector = attrs["sector"]

        validate_ownership(self.context, market, Market)
        validate_ownership(self.context, portfolio, Portfolio)
        validate_ownership(self.context, sector, Sector)
        return attrs

    def get_all_stats(self, obj):
        query = CompanyStatsForYear.objects.filter(
            company=obj.id, user=obj.user, year=9999
        )
        if query.exists():
            serializer = CompanyStatsForYearSerializer(query[0])
            return serializer.data
        return None

    def get_last_transaction_month(self, obj):
        query = SharesTransaction.objects.filter(
            company_id=obj.id, user=obj.user
        ).order_by("transaction_date")
        if query.exists():
            last_element = query[len(query)-1]
            return last_element.transaction_date
        return None

    def get_last_dividend_month(self, obj):
        query = DividendsTransaction.objects.filter(
            company_id=obj.id, user=obj.user
        ).order_by("transaction_date")
        if query.exists():
            last_element = query[len(query)-1]
            return last_element.transaction_date
        return None


class CompanySerializerGet(CompanySerializer):
    base_currency = SerializerMethodField()
    dividends_currency = SerializerMethodField()

    market = MarketSerializer(many=False, read_only=True)
    sector = SectorSerializerGet(many=False, read_only=True)
    shares_transactions = SharesTransactionSerializer(many=True, read_only=True)
    rights_transactions = RightsTransactionSerializer(many=True, read_only=True)
    dividends_transactions = DividendsTransactionSerializer(many=True, read_only=True)
    portfolio = PortfolioSerializerLite(many=False, read_only=True)
    first_year = serializers.SerializerMethodField()
    last_transaction_month = serializers.SerializerMethodField()
    stats = CompanyStatsForYearSerializer(many=True, read_only=True)


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

    def get_first_year(self, obj):
        query = SharesTransaction.objects.filter(
            company_id=obj.id, user=obj.user
        ).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None

    def get_last_transaction_month(self, obj):
        query = SharesTransaction.objects.filter(
            company_id=obj.id, user=obj.user
        ).order_by("transaction_date")
        if query.exists():
            return f"{query[len(query)-1].transaction_date.year}-{query[len(query)-1].transaction_date.month}"
        return None

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
            "isin",
            "is_closed",
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
            "first_year",
            "last_transaction_month",
        ]
