from asyncio.log import logger
from rest_framework.fields import SerializerMethodField
from rest_framework import serializers

from companies.serializers_lite import CompanySerializerLite
from currencies.models import Currency
from currencies.serializers import CurrencySerializer
from portfolios.models import Portfolio
from shares_transactions.models import SharesTransaction
from stats.serializers.portfolio_stats import PortfolioStatsForYearSerializer

import logging

logger = logging.getLogger("buho_backend")


class PortfolioSerializer(serializers.ModelSerializer):
    companies = CompanySerializerLite(many=True, read_only=True)

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
    # companies = CompanySerializer(many=True, read_only=True)
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
        logger.debug(f"obj.base_currency: {obj.base_currency}")
        currency = Currency.objects.filter(code=obj.base_currency)[0]
        logger.debug(f"currency: {currency}")
        serialized_currency = CurrencySerializer(currency)
        logger.debug(serialized_currency.data)
        return serialized_currency.data

    def get_first_year(self, obj):
        query = SharesTransaction.objects.filter(
            company__portfolio=obj.id, user=obj.user, company__is_closed=False
        ).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None
