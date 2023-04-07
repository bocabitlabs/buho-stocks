from buho_backend.admin import BaseAdmin
from companies.models import Company
from django.contrib import admin


# Register your models here.
@admin.register(Company)
class CompanyAdmin(BaseAdmin):
    list_display = ["id", "name", "ticker", "portfolio_link", "last_updated", "date_created"]
    search_fields = ["name", "ticker", "portfolio", "user"]
