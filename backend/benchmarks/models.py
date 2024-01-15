from decimal import Decimal

from django.db import models
from django.db.models.query import QuerySet
from djmoney.models.fields import MoneyField


class Benchmark(models.Model):
    name = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    years: QuerySet["BenchmarkYear"]  # To solve issue django-manager-missing

    class Meta:
        verbose_name = "Benchmark"
        verbose_name_plural = "Benchmarks"

    def __str__(self):
        return self.name

    def __repr___(self):
        return self.name


class BenchmarkYear(models.Model):
    value = MoneyField(max_digits=12, decimal_places=3)
    return_percentage = models.DecimalField(
        max_digits=12, decimal_places=3, default=Decimal(0)
    )
    year = models.IntegerField()

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    benchmark = models.ForeignKey(
        Benchmark, on_delete=models.CASCADE, related_name="years"
    )

    objects: QuerySet["BenchmarkYear"]  # To solve issue django-manager-missing

    class Meta:
        verbose_name = "Benchmark Year"
        verbose_name_plural = "Benchmark Years"
        unique_together = ("benchmark", "year")

    def __str__(self):
        return f"{self.benchmark} {self.year} ({self.value})"
