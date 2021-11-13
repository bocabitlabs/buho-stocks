from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Currency(models.Model):
    name = models.CharField(max_length=200)
    abbreviation = models.CharField(max_length=200)
    color = models.CharField(max_length=200)
    symbol = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return self.name
