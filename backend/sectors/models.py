from django.contrib.auth.models import User
from django.db import models


class SectorBase(models.Model):
    """
    Base class for the sectors models
    """

    class Meta:
        abstract = True

    name = models.CharField(max_length=200, unique=True)
    color = models.CharField(max_length=200)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str__(self):
        return self.name


class SuperSector(SectorBase):
    """Super sector model class"""

    class Meta:
        ordering = ["name"]


class Sector(SectorBase):
    """Sector model class"""

    super_sector = models.ForeignKey(
        SuperSector, on_delete=models.SET_NULL, related_name="sectors", null=True
    )

    class Meta:
        ordering = ["name"]
