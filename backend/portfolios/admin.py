from django.contrib import admin
from buho_backend.admin import BaseAdmin

from portfolios.models import Portfolio

# Register your models here.
@admin.register(Portfolio)
class PortfolioAdmin(BaseAdmin):
    list_display = ['id', 'name', 'user_link', 'last_updated', 'date_created']
    search_fields = ['name', 'user']
