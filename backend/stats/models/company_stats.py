import logging

from django.db import models

from companies.models import Company

logger = logging.getLogger("buho_backend")


# Create your models here.
class CompanyStatsForYear(models.Model):
    year = models.IntegerField()
    shares_count = models.IntegerField()
    invested = models.DecimalField(max_digits=12, decimal_places=3)
    dividends = models.DecimalField(max_digits=12, decimal_places=3)
    dividends_yield = models.DecimalField(max_digits=12, decimal_places=3, null=True)
    portfolio_currency = models.CharField(max_length=200)
    accumulated_investment = models.DecimalField(max_digits=12, decimal_places=3)
    accumulated_dividends = models.DecimalField(max_digits=12, decimal_places=3)
    stock_price_value = models.DecimalField(max_digits=12, decimal_places=3, null=True)
    stock_price_currency = models.CharField(max_length=200, default="")
    stock_price_transaction_date = models.DateField(null=True)
    portfolio_value = models.DecimalField(max_digits=12, decimal_places=3)
    portfolio_value_is_down = models.BooleanField()
    return_value = models.DecimalField(max_digits=12, decimal_places=3)
    return_percent = models.DecimalField(max_digits=12, decimal_places=3)
    accumulated_return_percent = models.DecimalField(max_digits=12, decimal_places=3, null=True)
    return_with_dividends = models.DecimalField(max_digits=12, decimal_places=3)
    return_with_dividends_percent = models.DecimalField(max_digits=12, decimal_places=3)
    accumulated_return_with_dividends_percent = models.DecimalField(max_digits=12, decimal_places=3, null=True)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="stats")

    class Meta:
        unique_together = [["year", "company"]]
        verbose_name = "Company Stats"
        verbose_name_plural = "Companies Stats"

    def __str__(self):
        return f"Company Stats: {self.company.name} ({self.year})"
