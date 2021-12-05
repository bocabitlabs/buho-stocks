from django.db import models


class ExchangeRate(models.Model):

    exchange_from = models.CharField(max_length=200)
    exchange_to = models.CharField(max_length=200)
    exchange_rate = models.DecimalField(max_digits=29, decimal_places=19)
    exchange_date = models.DateField()

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str___(self):
        return f"{self.exchange_from}{self.exchange_to} - {self.exchange_rate} ({self.exchange_date})"

    class Meta:
        unique_together = ("exchange_from", "exchange_to", "exchange_date")
