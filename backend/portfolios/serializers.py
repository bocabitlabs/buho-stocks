from portfolios.models import Portfolio
from rest_framework import serializers
from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from companies.serializers import CompanySerializer


class PortfolioSerializer(serializers.ModelSerializer):
    base_currency = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), many=False, read_only=False
    )
    companies = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "color",
            "date_created",
            "last_updated",
            "hide_closed_companies",
            "base_currency",
            "companies",
        ]


class PortfolioSerializerGet(PortfolioSerializer):
    base_currency = CurrencySerializer(many=False, read_only=True)
    companies = CompanySerializer(many=True, read_only=True)
