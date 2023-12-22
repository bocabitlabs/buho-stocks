from django.contrib import admin

from buho_backend.admin import BaseAdmin
from currencies.models import Currency


# Register your models here.
@admin.register(Currency)
class CurrencyAdmin(BaseAdmin):
    list_display = ["id", "code", "symbol", "name"]
    search_fields = ["code", "name"]
