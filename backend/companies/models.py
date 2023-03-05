from django.contrib.auth.models import User
from django.db import models
from markets.models import Market
from portfolios.models import Portfolio
from sectors.models import Sector


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
    return f"user_{instance.user.id}/{filename}"


# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=200)
    alt_tickers = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(max_length=200, blank=True, null=True)
    color = models.CharField(max_length=200)
    broker = models.CharField(max_length=200)
    country_code = models.CharField(max_length=200)
    isin = models.CharField(max_length=200, blank=True, null=True)

    is_closed = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    base_currency = models.CharField(max_length=50)
    dividends_currency = models.CharField(max_length=50)

    sector = models.ForeignKey(Sector, on_delete=models.RESTRICT, related_name="companies")
    market = models.ForeignKey(Market, on_delete=models.RESTRICT, related_name="companies")
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="companies")
    logo = models.ImageField(upload_to=user_directory_path, blank=True, null=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"{self.name}, {self.ticker}"
