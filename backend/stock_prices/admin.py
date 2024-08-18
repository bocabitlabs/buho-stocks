from django.contrib import admin

from stock_prices.models import StockPrice


@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ["ticker", "price", "transaction_date"]
