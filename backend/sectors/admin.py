from django.contrib import admin
from sectors.models import Sector
from buho_backend.admin import BaseAdmin


# Register your models here.
@admin.register(Sector)
class SectorAdmin(BaseAdmin):
    list_display = ['id', 'name', 'user_link', 'last_updated', 'date_created']
    search_fields = ['name', 'user']
    list_filter = ('user',)