from rest_framework import serializers

from companies.serializers_lite import CompanySerializerLite
from stats.models.company_stats import CompanyStatsForYear


class CompanyStatsForYearSerializer(serializers.ModelSerializer):
    company = CompanySerializerLite(many=False, read_only=True)
    sector_name = serializers.CharField(source="company.sector.name")
    super_sector_name = serializers.CharField(source="company.sector.super_sector.name", allow_null=True)
    currency_code = serializers.CharField(source="company.base_currency", allow_null=True)
    broker = serializers.CharField(source="company.broker", allow_null=True)
    market_name = serializers.CharField(source="company.market.name", allow_null=True)

    class Meta:
        model = CompanyStatsForYear
        fields = [
            "year",
            "company",
            "sector_name",
            "super_sector_name",
            "currency_code",
            "market_name",
            "broker",
            "shares_count",
            "invested",
            "dividends",
            "dividends_yield",
            "portfolio_currency",
            "accumulated_investment",
            "accumulated_dividends",
            "stock_price_value",
            "stock_price_currency",
            "stock_price_transaction_date",
            "portfolio_value",
            "portfolio_value_is_down",
            "return_value",
            "return_percent",
            "return_with_dividends",
            "return_with_dividends_percent",
        ]
