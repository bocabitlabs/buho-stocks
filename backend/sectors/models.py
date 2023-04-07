from django.db import models


class SectorBase(models.Model):
    """
    Base class for the sectors models
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, unique=True)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class SuperSector(SectorBase):
    """Super sector model class"""

    class Meta:
        ordering = ["name"]


class Sector(SectorBase):
    """Sector model class"""

    super_sector = models.ForeignKey(SuperSector, on_delete=models.SET_NULL, related_name="sectors", null=True)

    class Meta:
        ordering = ["name"]
