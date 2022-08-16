from django.contrib import admin
from sectors.models import Sector, SuperSector
from buho_backend.admin import BaseAdmin


# Register your models here.
@admin.register(Sector)
class SectorAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]


@admin.register(SuperSector)
class SuperSectorAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]
