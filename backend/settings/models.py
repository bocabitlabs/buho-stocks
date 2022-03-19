from django.contrib.auth.models import User
from django.db import models

from markets.models import TIMEZONES

# Create your models here.
class UserSettings(models.Model):
    language = models.CharField(max_length = 200)
    main_portfolio = models.CharField(max_length = 200)
    portfolio_sort_by = models.CharField(max_length = 200)
    portfolio_display_mode = models.CharField(max_length = 200)
    company_sort_by = models.CharField(max_length = 200)
    company_display_mode = models.CharField(max_length = 200)
    timezone = models.CharField(max_length=200, choices=TIMEZONES, default="UTC")

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    # user = models.ForeignKey(User, on_delete = models.CASCADE, blank = True, null = False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)