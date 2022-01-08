from rest_framework.fields import SerializerMethodField
from rest_framework import serializers

from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from currencies.models import get_currency_details
from portfolios.models import Portfolio
from companies.serializers import CompanySerializerGet


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
    base_currency = SerializerMethodField()
    companies = CompanySerializerGet(many=True, read_only=True)

    def get_base_currency(self, obj):
        return get_currency_details(
            obj.base_currency
        )  # access the price of the product associated with the order_unit object
