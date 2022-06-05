from django.contrib import admin
from stats.models.portfolio_stats import PortfolioStatsForYear
from buho_backend.admin import BaseAdmin

from stats.models.company_stats import CompanyStatsForYear

# Register your models here.
@admin.register(CompanyStatsForYear)
class CompanyStatsForYearAdmin(BaseAdmin):
    list_display = ['id', 'year', 'company_link', 'user_link', 'last_updated', 'date_created']
    search_fields = ['year', 'user', 'company']
    list_filter = ['user']

@admin.register(PortfolioStatsForYear)
class PortfoliotatsForYearAdmin(BaseAdmin):
    list_display = ['id', 'year', 'portfolio_link', 'user_link', 'last_updated', 'date_created']
    search_fields = ['year', 'user', 'portfolio']
    list_filter = ['user']
