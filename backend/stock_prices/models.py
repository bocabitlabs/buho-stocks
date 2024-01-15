from django.db import models
from django.db.models.query import QuerySet
from djmoney.models.fields import MoneyField


class StockPrice(models.Model):
    price = MoneyField(max_digits=12, decimal_places=3)
    transaction_date = models.DateField()
    ticker = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    objects: QuerySet["StockPrice"]  # To solve issue django-manager-missing

    class Meta:
        unique_together = ("ticker", "transaction_date")
        verbose_name = "Stock Price"
        verbose_name_plural = "Stock Prices"

    def __str__(self):
        return f"{self.ticker} - {self.price} ({self.transaction_date})"
