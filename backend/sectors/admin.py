from django.contrib import admin

from buho_backend.admin import BaseAdmin
from sectors.models import Sector, SuperSector


# Register your models here.
@admin.register(Sector)
class SectorAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]


@admin.register(SuperSector)
class SuperSectorAdmin(BaseAdmin):
    list_display = ["id", "name", "last_updated", "date_created"]
    search_fields = ["name"]
