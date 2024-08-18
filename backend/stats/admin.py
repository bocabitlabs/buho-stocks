from django.contrib import admin

from buho_backend.admin import BaseAdmin
from stats.models.company_stats import CompanyStatsForYear
from stats.models.portfolio_stats import PortfolioStatsForYear


# Register your models here.
@admin.register(CompanyStatsForYear)
class CompanyStatsForYearAdmin(BaseAdmin):
    list_display = ["id", "year", "company_link", "last_updated", "date_created"]
    search_fields = ["year", "company"]


@admin.register(PortfolioStatsForYear)
class PortfoliotatsForYearAdmin(BaseAdmin):
    list_display = ["id", "year", "portfolio_link", "last_updated", "date_created"]
    search_fields = ["year", "portfolio"]
