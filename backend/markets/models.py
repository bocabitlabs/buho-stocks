from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Market(models.Model):
    name = models.CharField(max_length = 200)
    description = models.TextField()
    color = models.CharField(max_length = 200)
    region = models.CharField(max_length = 200)
    open_time = models.TimeField()
    close_time = models.TimeField()

    date_created = models.DateTimeField(auto_created=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete = models.CASCADE, blank = True, null = True)


    def __str___(self):
        return self.title