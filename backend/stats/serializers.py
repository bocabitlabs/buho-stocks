from rest_framework import serializers
from stats.models import CompanyStatsForYear


class CompanyStatsForYearSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyStatsForYear
        fields = [
            "shares_count",
            "invested",
            "dividends",
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