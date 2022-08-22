from decimal import Decimal
from django.db import models
from djmoney.models.fields import MoneyField


class Benchmark(models.Model):

    name = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def __repr___(self):
        return self.name


class BenchmarkYear(models.Model):

    value = MoneyField(max_digits=12, decimal_places=3, default_currency=None)
    return_percentage = models.DecimalField(
        max_digits=12, decimal_places=3, default=Decimal(0)
    )
    year = models.IntegerField()

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    benchmark = models.ForeignKey(
        Benchmark, on_delete=models.CASCADE, related_name="years"
    )

    def __str__(self):
        return f"{self.benchmark} {self.year} ({self.value})"

    class Meta:
        unique_together = ("benchmark", "year")
