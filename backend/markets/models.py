from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Market(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    color = models.CharField(max_length=200)
    region = models.CharField(max_length=200)
    open_time = models.TimeField()
    close_time = models.TimeField()

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return f"{self.name} {self.region} ({self.open_time}-{self.close_time})"

    class Meta:
        ordering = ['name']
