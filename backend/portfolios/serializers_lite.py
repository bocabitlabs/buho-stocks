from rest_framework import serializers
from portfolios.models import Portfolio

class PortfolioSerializerLite(serializers.ModelSerializer):

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "country_code",
            "base_currency",
        ]
