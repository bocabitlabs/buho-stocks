import logging

from django.conf import settings
from django.contrib import admin
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.views import redirect_to_login
from django.http import HttpResponseRedirect
from django.shortcuts import resolve_url
from django.urls import reverse
from django.utils.http import is_safe_url
from django.utils.safestring import mark_safe
from two_factor.admin import AdminSiteOTPRequired, AdminSiteOTPRequiredMixin

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


class AdminSiteOTPRequiredMixinRedirSetup(AdminSiteOTPRequired):
    def login(self, request, extra_context=None):
        redirect_to = request.POST.get(REDIRECT_FIELD_NAME, request.GET.get(REDIRECT_FIELD_NAME))
        # For users not yet verified the AdminSiteOTPRequired.has_permission
        # will fail. So use the standard admin has_permission check:
        # (is_active and is_staff) and then check for verification.
        # Go to index if they pass, otherwise make them setup OTP device.
        logger.info("Loading OTPRequired")
        # pylint: disable=bad-super-call
        if request.method == "GET" and super(
            AdminSiteOTPRequiredMixin,
            self,
        ).has_permission(  # type: ignore
            request
        ):
            # Already logged-in and verified by OTP
            if request.user.is_verified():
                # User has permission
                index_path = reverse("admin:index", current_app=self.name)
            else:
                # User has permission but no OTP set:
                index_path = reverse("two_factor:setup", current_app=self.name)
            return HttpResponseRedirect(index_path)

        if not redirect_to or not is_safe_url(url=redirect_to, allowed_hosts=[request.get_host()]):
            redirect_to = resolve_url(settings.LOGIN_REDIRECT_URL)

        return redirect_to_login(redirect_to)
