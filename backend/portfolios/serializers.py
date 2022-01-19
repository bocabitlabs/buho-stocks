from rest_framework.fields import SerializerMethodField
from rest_framework import serializers

from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from currencies.models import get_currency_details
from portfolios.models import Portfolio
from companies.serializers import CompanySerializer, CompanySerializerGet
from shares_transactions.models import SharesTransaction
from stats.serializers import PortfolioStatsForYearSerializer


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
    companies = CompanySerializer(many=True, read_only=True)
    first_year = serializers.SerializerMethodField()
    stats = PortfolioStatsForYearSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "color",
            "country_code",
            "date_created",
            "first_year",
            "last_updated",
            "hide_closed_companies",
            "base_currency",
            "companies",
            "stats",
        ]

    def get_base_currency(self, obj):
        return get_currency_details(
            obj.base_currency
        )  # access the price of the product associated with the order_unit object

    def get_first_year(self, obj):
        query = SharesTransaction.objects.filter(
            company__portfolio=obj.id, user=obj.user
        ).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None

    # def get_all_stats(self, obj):
    #     query = Portfolio.objects.filter(
    #         company__portfolio=obj.id, user=obj.user
    #     ).order_by("transaction_date")
    #     if query.exists():
    #         return query[0].transaction_date.year
    #     return None
