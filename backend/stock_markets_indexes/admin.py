import json
import logging
from os import path
import pathlib
from django.contrib import admin, messages
from django_object_actions import DjangoObjectActions

from djmoney.money import Money

from buho_backend.admin import BaseAdmin
from stock_markets_indexes.models import StockMarketIndex, StockMarketIndexYear

logger = logging.getLogger("buho_backend")

# Register your models here.
@admin.register(StockMarketIndex)
class StockMarketIndexAdmin(DjangoObjectActions, BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name", "id"]

    # actions = [create_indexes]

    def populate_years(self, request, obj):
        logger.debug("Creating indexes")
        logger.debug(obj.name)
        if obj.name in ["S&P 500", "MSCI World"]:
            # Convert obj.name to url friendly format
            new_name = obj.name.replace(" ", "-").lower()
            with open(
                path.join(
                    pathlib.Path(__file__).parent.resolve(),
                    "data",
                    f"{new_name}.json",
                ),
                "r",
                encoding="utf-8",
            ) as file:
                data = file.read()
                data = json.loads(data)
                handled_years = 0
                for year in data:
                    StockMarketIndexYear.objects.create(
                        index=obj,
                        year=year["year"],
                        value=Money(year["value"], year["value_currency"]),
                        return_percentage=year["return_percentage"],
                    )
                    handled_years += 1

                messages.info(
                    request, f"{handled_years} years populated for {obj.name}"
                )
        else:
            messages.error(
                request,
                f"{obj.name} is not supported. Only S&P 500 and MSCI World are supported",
            )

    populate_years.label = "Populate years"  # optional
    populate_years.short_description = (
        "Populate the years of this Index if they exist"  # optional
    )

    change_actions = ("populate_years",)


@admin.register(StockMarketIndexYear)
class StockMarketIndexYearAdmin(BaseAdmin):
    list_display = [
        "id",
        "value",
        "year",
        "return_percentage",
        "index",
        "last_updated",
        "date_created",
    ]
    search_fields = ["year", "id", "index"]
