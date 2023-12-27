from django.db import models


# Create your models here.
class Portfolio(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    color = models.CharField(max_length=200)
    hide_closed_companies = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    base_currency = models.CharField(max_length=50)
    country_code = models.CharField(max_length=200)

    class Meta:
        ordering = ["name"]
        verbose_name = "Portfolio"
        verbose_name_plural = "Portfolios"

    def __str__(self):
        return f"{self.name} ({self.base_currency})"
