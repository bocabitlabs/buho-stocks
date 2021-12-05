from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from currencies.serializers import CurrencySerializer
from portfolios.models import Portfolio
from rest_framework import serializers
from companies.serializers import CompanySerializer


class PortfolioSerializer(serializers.ModelSerializer):
    companies = UserFilteredPrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "color",
            "country_code",
            "date_created",
            "last_updated",
            "hide_closed_companies",
            "base_currency",
            "companies",
        ]


class PortfolioSerializerGet(PortfolioSerializer):
    base_currency = CurrencySerializer(many=False, read_only=True)
    companies = CompanySerializer(many=True, read_only=True)
