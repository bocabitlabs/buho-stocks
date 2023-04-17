import logging

from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

logger = logging.getLogger("buho_backend")


# Register your models here.
class BaseAdmin(admin.ModelAdmin):
    def company_link(self, obj):
        url = reverse("admin:companies_company_change", args=(obj.company.pk,))
        return mark_safe(f"<a href='{url}'>{obj.company}</a>")  # nosec

    company_link.short_description = "company"  # type: ignore

    def portfolio_link(self, obj):
        url = reverse("admin:portfolios_portfolio_change", args=(obj.portfolio.pk,))
        return mark_safe(f"<a href='{url}'>{obj.portfolio}</a>")  # nosec

    portfolio_link.short_description = "portfolio"  # type: ignore
