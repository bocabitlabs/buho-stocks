from django.db import models
import pytz


TIMEZONES = tuple(zip(pytz.all_timezones, pytz.all_timezones))


# Create your models here.
class Market(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    region = models.CharField(max_length=200)
    open_time = models.TimeField()
    close_time = models.TimeField()
    timezone = models.CharField(max_length=200, choices=TIMEZONES, default="UTC")

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.region})"

    class Meta:
        ordering = ["name"]


def get_all_timezones():
    return [{"name": name} for name in pytz.all_timezones]
