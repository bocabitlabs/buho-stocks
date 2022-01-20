import logging
from django.db import models
from django.contrib.auth.models import User

from portfolios.models import Portfolio


logger = logging.getLogger("buho_backend")

class PortfolioStatsForYear(models.Model):
    year = models.IntegerField()
    invested = models.DecimalField(max_digits=12, decimal_places=3)
    dividends = models.DecimalField(max_digits=12, decimal_places=3)
    dividends_yield = models.DecimalField(max_digits=12, decimal_places=3, null=True)
    portfolio_currency = models.CharField(max_length=200)
    accumulated_investment = models.DecimalField(max_digits=12, decimal_places=3)
    accumulated_dividends = models.DecimalField(max_digits=12, decimal_places=3)
    portfolio_value = models.DecimalField(max_digits=12, decimal_places=3)
    return_value = models.DecimalField(max_digits=12, decimal_places=3)
    return_percent = models.DecimalField(max_digits=12, decimal_places=3)
    return_with_dividends = models.DecimalField(max_digits=12, decimal_places=3)
    return_with_dividends_percent = models.DecimalField(max_digits=12, decimal_places=3)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name="stats"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    class Meta:
        unique_together = [['year', 'portfolio']]