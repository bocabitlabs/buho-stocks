from django.db import models
from markets.models import TIMEZONES


# Create your models here.
class UserSettings(models.Model):
    language = models.CharField(max_length=200)
    main_portfolio = models.CharField(max_length=200, blank=True)
    portfolio_sort_by = models.CharField(max_length=200, blank=True)
    portfolio_display_mode = models.CharField(max_length=200, blank=True)
    company_sort_by = models.CharField(max_length=200, blank=True)
    company_display_mode = models.CharField(max_length=200, blank=True)
    timezone = models.CharField(max_length=200, choices=TIMEZONES, default="UTC")

    allow_fetch = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Settings"
        verbose_name_plural = "User Settings"

    def __str__(self):
        return f"Settings: {self.language}, {self.main_portfolio}"
