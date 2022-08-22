from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField

from benchmarks.models import Benchmark, BenchmarkYear


class BenchmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Benchmark
        fields = [
            "id",
            "name",
            "date_created",
            "last_updated",
        ]


class BenchmarkYearSerializer(serializers.ModelSerializer):

    value = MoneyField(max_digits=12, decimal_places=3)
    value_currency = serializers.CharField(max_length=50)

    class Meta:
        model = BenchmarkYear
        fields = [
            "id",
            "year",
            "benchmark",
            "value",
            "return_percentage",
            "value_currency",
            "date_created",
            "last_updated",
        ]
