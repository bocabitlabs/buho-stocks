from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Portfolio(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    color = models.CharField(max_length=200)
    hide_closed_companies = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    base_currency = models.CharField(max_length=50)
    country_code = models.CharField(max_length=200)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str__(self):
        return f"{self.name} ({self.base_currency})"

    class Meta:
        ordering = ['name']
