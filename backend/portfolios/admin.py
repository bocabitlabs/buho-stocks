from buho_backend.admin import BaseAdmin
from django.contrib import admin
from portfolios.models import Portfolio


# Register your models here.
@admin.register(Portfolio)
class PortfolioAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]
