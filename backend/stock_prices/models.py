from django.db import models
from djmoney.models.fields import MoneyField


class StockPrice(models.Model):
    price = MoneyField(max_digits=12, decimal_places=3)
    transaction_date = models.DateField()
    ticker = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str___(self):
        return f"{self.ticker} - {self.price} ({self.transaction_date})"

    class Meta:
        unique_together = ("ticker", "transaction_date")
