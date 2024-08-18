import pytz
from django.db import models

TIMEZONES = tuple(zip(pytz.all_timezones, pytz.all_timezones))


# Create your models here.
class Market(models.Model):
    id = models.AutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200, unique=True)
    description: models.TextField = models.TextField()
    region: models.CharField = models.CharField(max_length=200)
    open_time: models.TimeField = models.TimeField()
    close_time: models.TimeField = models.TimeField()
    timezone: models.CharField = models.CharField(
        max_length=200, choices=TIMEZONES, default="UTC"
    )

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Market"
        verbose_name_plural = "Markets"

    def __str__(self) -> str:
        return f"{self.name} ({self.region})"


def get_all_timezones():
    return [{"name": name} for name in pytz.all_timezones]
