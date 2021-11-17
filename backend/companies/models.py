from django.contrib.auth.models import User
from django.db import models
from currencies.models import Currency
from sectors.models import Sector
from markets.models import Market
from portfolios.models import Portfolio

# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=200)
    alt_tickers = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField(max_length=200)
    color = models.CharField(max_length=200)
    broker = models.CharField(max_length=200)
    country_code = models.CharField(max_length=200)

    is_closed = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    currency = models.ForeignKey(
        Currency, on_delete=models.RESTRICT, related_name="companies"
    )
    dividends_currency = models.ForeignKey(Currency, on_delete=models.RESTRICT)

    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="companies"
    )
    market = models.ForeignKey(
        Market, on_delete=models.RESTRICT, related_name="companies"
    )
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name="companies"
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return self.name
