from django.db import models

# Create your models here.
class Currency(models.Model):
    code = models.CharField(max_length=200, unique=True)
    symbol = models.CharField(max_length=200)
    name = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        ordering = ["code"]
        verbose_name_plural = "currencies"
