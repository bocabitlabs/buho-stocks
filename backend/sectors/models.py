from django.contrib.auth.models import User
from django.db import models


class SectorBase(models.Model):
    class Meta:
        abstract = True

    name = models.CharField(max_length=200)
    color = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)


# Create your models here.
class SuperSector(SectorBase):
    pass


# Create your models here.
class Sector(SectorBase):
    super_sector = models.ForeignKey(SuperSector, on_delete=models.CASCADE, related_name='sectors')

    def __str___(self):
        return self.title
