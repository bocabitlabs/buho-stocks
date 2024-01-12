import logging

from django.conf import settings
from drf_extra_fields.fields import Base64ImageField  # type: ignore
from rest_framework import serializers

from companies.models import Company
from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.serializers import DividendsTransactionSerializer
from markets.models import Market
from markets.serializers import MarketSerializer
from portfolios.models import Portfolio
from portfolios.serializers_lite import PortfolioSerializerLite
from rights_transactions.serializers import RightsTransactionSerializer
from sectors.models import Sector
from sectors.serializers import SectorSerializerGet
from shares_transactions.models import SharesTransaction
from shares_transactions.serializers import SharesTransactionSerializer
from stats.models.company_stats import CompanyStatsForYear
from stats.serializers.company_stats import CompanyStatsForYearSerializer

logger: logging.Logger = logging.getLogger("buho_backend")


class CompanySerializer(serializers.ModelSerializer):
    market = serializers.PrimaryKeyRelatedField(
        queryset=Market.objects, many=False, read_only=False
    )
    sector = serializers.PrimaryKeyRelatedField(
        queryset=Sector.objects, many=False, read_only=False
    )
    portfolio = serializers.PrimaryKeyRelatedField(
        queryset=Portfolio.objects, many=False, read_only=False
    )

    logo = Base64ImageField(
        max_length=None, use_url=True, allow_null=True, required=False
    )
    all_stats = serializers.SerializerMethodField()
    last_transaction_month = serializers.SerializerMethodField()
    last_dividend_month = serializers.SerializerMethodField()
    sector_name = serializers.CharField(source="sector.name", read_only=True)

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
            "is_closed",
            "isin",
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

    def get_all_stats(self, obj):
        query = CompanyStatsForYear.objects.filter(
            company=obj.id, year=settings.YEAR_FOR_ALL
        )
        if query.exists():
            serializer = CompanyStatsForYearSerializer(query[0])
            return serializer.data
        return None

    def get_last_transaction_month(self, obj):
        query = SharesTransaction.objects.filter(company_id=obj.id).order_by(
            "transaction_date"
        )
        if query.exists():
            last_element = query[len(query) - 1]
            return last_element.transaction_date
        return None

    def get_last_dividend_month(self, obj):
        query = DividendsTransaction.objects.filter(company_id=obj.id).order_by(
            "transaction_date"
        )
        if query.exists():
            last_element = query[len(query) - 1]
            return last_element.transaction_date
        return None


class CompanySerializerGet(serializers.ModelSerializer):
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
        currency = Currency.objects.filter(code=obj.base_currency).first()
        serialized_currency = CurrencySerializer(currency)
        return serialized_currency.data

    def get_dividends_currency(self, obj):
        currency = Currency.objects.filter(code=obj.dividends_currency).first()
        serialized_currency = CurrencySerializer(currency)
        return serialized_currency.data

    def get_logo(self, obj):
        request = self.context.get("request")
        photo_url = obj.fingerprint.url
        if request:
            return request.build_absolute_uri(photo_url)
        return None

    def get_first_year(self, obj):
        query = SharesTransaction.objects.filter(company_id=obj.id).order_by(
            "transaction_date"
        )
        if query.exists():
            return query[0].transaction_date.year
        return None

    def get_last_transaction_month(self, obj):
        query = SharesTransaction.objects.filter(company_id=obj.id).order_by(
            "transaction_date"
        )
        if query.exists():
            last_transaction = query[len(query) - 1]
            year = last_transaction.transaction_date.year
            month = last_transaction.transaction_date.month
            return f"{year}-{month}"
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
