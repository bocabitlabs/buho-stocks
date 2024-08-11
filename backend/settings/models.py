from django.db import models

from markets.models import TIMEZONES


# Create your models here.
class UserSettings(models.Model):
    language = models.CharField(max_length=200)
    main_portfolio = models.CharField(max_length=200, blank=True, default="")
    portfolio_sort_by = models.CharField(max_length=200, blank=True, default="")
    portfolio_display_mode = models.CharField(max_length=200, blank=True, default="")
    company_sort_by = models.CharField(max_length=200, blank=True, default="")
    company_display_mode = models.CharField(max_length=200, blank=True, default="")
    timezone = models.CharField(max_length=200, choices=TIMEZONES, default="UTC")
    sentry_dsn = models.CharField(max_length=200, blank=True, default="")
    sentry_enabled = models.BooleanField(default=False)
    display_welcome = models.BooleanField(default=True)

    allow_fetch = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Settings"
        verbose_name_plural = "User Settings"

    def __str__(self):
        return f"Language: {self.language}, {self.main_portfolio}"
