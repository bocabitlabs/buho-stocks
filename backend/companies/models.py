from __future__ import annotations  # To make TYPE_CHECKING work

from typing import TYPE_CHECKING

from django.db import models
from django.db.models.query import QuerySet
from django_stubs_ext.db.models import TypedModelMeta

from markets.models import Market
from portfolios.models import Portfolio
from sectors.models import Sector

if TYPE_CHECKING:
    from dividends_transactions.models import DividendsTransaction
    from rights_transactions.models import RightsTransaction
    from shares_transactions.models import SharesTransaction


def user_directory_path(instance, filename) -> str:
    return f"user/{filename}"


# Create your models here.
class Company(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=200)
    alt_tickers: models.CharField = models.CharField(
        max_length=200, blank=True, default=""
    )
    description = models.TextField(blank=True, default="")
    url = models.URLField(max_length=200, blank=True, default="")
    color = models.CharField(max_length=200)
    broker = models.CharField(max_length=200, blank=True)
    country_code = models.CharField(max_length=200)
    isin = models.CharField(max_length=200, blank=True, default="")

    is_closed = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    base_currency = models.CharField(max_length=50)
    dividends_currency = models.CharField(max_length=50)

    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="companies"
    )
    market = models.ForeignKey(
        Market, on_delete=models.RESTRICT, related_name="companies"
    )
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name="companies"
    )
    logo = models.ImageField(upload_to=user_directory_path, blank=True, null=True)

    shares_transactions: QuerySet["SharesTransaction"]
    dividends_transactions: QuerySet["DividendsTransaction"]
    rights_transactions: QuerySet["RightsTransaction"]

    class Meta(TypedModelMeta):
        ordering = ["name"]
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self) -> str:
        return (
            f"Name: {self.name}, Ticker: {self.ticker}, "
            f"B.Currency: {self.base_currency} D.Currency: {self.dividends_currency}"
        )
