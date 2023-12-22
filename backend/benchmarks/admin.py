import logging

from django.contrib import admin

from benchmarks.models import Benchmark, BenchmarkYear
from buho_backend.admin import BaseAdmin

logger = logging.getLogger("buho_backend")


# Register your models here.
@admin.register(Benchmark)
class BenchmarkAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name", "id"]


@admin.register(BenchmarkYear)
class StockMarketIndexYearAdmin(BaseAdmin):
    list_display = [
        "id",
        "value",
        "year",
        "return_percentage",
        "benchmark",
        "last_updated",
        "date_created",
    ]
    search_fields = ["year", "id", "benchmark"]
