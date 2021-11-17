from django.contrib.auth.models import User
from django.db import models
from currencies.models import Currency

# Create your models here.
class Portfolio(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    color = models.CharField(max_length=200)
    hide_closed_companies = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    base_currency = models.ForeignKey(
        Currency, on_delete=models.RESTRICT, related_name="portfolios"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return self.name
