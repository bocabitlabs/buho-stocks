from typing import TYPE_CHECKING

from django.db import models
from markets.models import Market
from portfolios.models import Portfolio
from sectors.models import Sector

if TYPE_CHECKING:
    # This doesn't really exists on django so it always need to be imported this way
    from dividends_transactions.models import DividendsTransaction  # noqa
    from django.db.models.manager import RelatedManager
    from rights_transactions.models import RightsTransaction  # noqa
    from shares_transactions.models import SharesTransaction  # noqa


def user_directory_path(instance, filename) -> str:
    return f"user/{filename}"


# Create your models here.
class Company(models.Model):
    id = models.AutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200)
    ticker: models.CharField = models.CharField(max_length=200)
    alt_tickers: models.CharField = models.CharField(max_length=200, blank=True, default="")
    description: models.TextField = models.TextField(blank=True, default="")
    url: models.URLField = models.URLField(max_length=200, blank=True, default="")
    color: models.CharField = models.CharField(max_length=200)
    broker: models.CharField = models.CharField(max_length=200)
    country_code: models.CharField = models.CharField(max_length=200)
    isin: models.CharField = models.CharField(max_length=200, blank=True, default="")

    is_closed: models.BooleanField = models.BooleanField(default=False)

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    base_currency: models.CharField = models.CharField(max_length=50)
    dividends_currency: models.CharField = models.CharField(max_length=50)

    sector_id: int
    sector = models.ForeignKey["Sector"](Sector, on_delete=models.RESTRICT, related_name="companies")
    market_id: int
    market = models.ForeignKey["Market"](Market, on_delete=models.RESTRICT, related_name="companies")
    portfolio_id: int
    portfolio = models.ForeignKey["Portfolio"](Portfolio, on_delete=models.CASCADE, related_name="companies")
    logo: models.ImageField = models.ImageField(upload_to=user_directory_path, blank=True, null=True)

    if TYPE_CHECKING:
        shares_transactions = RelatedManager["SharesTransaction"]()
        rights_transactions = RelatedManager["RightsTransaction"]()
        dividends_transactions = RelatedManager["DividendsTransaction"]()

    class Meta:
        ordering = ["name"]
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self) -> str:
        return f"Name: {self.name}, Ticker: {self.ticker}, B.Currency: {self.base_currency} D.Currency: {self.dividends_currency}"
