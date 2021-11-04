from django.contrib.auth.models import User
from django.db import models


class SectorBase(models.Model):
    """
    Base class for the sectors models
    """

    class Meta:
        abstract = True

    name = models.CharField(max_length=200)
    color = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)


class SuperSector(SectorBase):
    """Super sector model class"""


class Sector(SectorBase):
    """Sector model class"""

    super_sector = models.ForeignKey(
        SuperSector, on_delete=models.CASCADE, related_name="sectors"
    )

    def __str___(self):
        return self.name
