from rest_framework import serializers

from stats.models.portfolio_stats import PortfolioStatsForYear


class PortfolioStatsForYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioStatsForYear
        fields = [
            "year",
            "invested",
            "dividends",
            "dividends_yield",
            "portfolio_currency",
            "accumulated_investment",
            "accumulated_dividends",
            "portfolio_value",
            "return_value",
            "return_percent",
            "return_with_dividends",
            "return_with_dividends_percent",
        ]
