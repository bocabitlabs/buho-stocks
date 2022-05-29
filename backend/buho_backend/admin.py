from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe


# Register your models here.
class BaseAdmin(admin.ModelAdmin):

    def company_link(self, obj):
        url = reverse("admin:companies_company_change", args=(obj.company.pk,))
        return mark_safe(f"<a href='{url}'>{obj.company}</a>")
    company_link.short_description = 'company'

    def portfolio_link(self, obj):
        url = reverse("admin:portfolios_portfolio_change", args=(obj.portfolio.pk,))
        return mark_safe(f"<a href='{url}'>{obj.portfolio}</a>")
    portfolio_link.short_description = 'portfolio'


    def user_link(self, obj):
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse("admin:auth_user_change", args=(obj.user.pk,)),
            f"{obj.user.username} ({obj.user.id})"
        ))
    user_link.short_description = 'user'