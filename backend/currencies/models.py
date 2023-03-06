from django.db import models


# Create your models here.
class Currency(models.Model):
    id = models.AutoField(primary_key=True)
    code: models.CharField = models.CharField(max_length=200, unique=True)
    symbol: models.CharField = models.CharField(max_length=200)
    name: models.CharField = models.CharField(max_length=200)

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code"]
        verbose_name = "Currency"
        verbose_name_plural = "currencies"

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"
