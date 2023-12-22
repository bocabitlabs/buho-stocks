from django.contrib import admin

from buho_backend.admin import BaseAdmin
from markets.models import Market


# Register your models here.
@admin.register(Market)
class MarketAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]
