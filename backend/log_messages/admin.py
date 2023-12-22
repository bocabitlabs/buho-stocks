from django.contrib import admin

from buho_backend.admin import BaseAdmin
from log_messages.models import LogMessage


# Register your models here.
@admin.register(LogMessage)
class LogMessageAdmin(BaseAdmin):
    list_display = ["id", "message_type", "portfolio_link", "date_created"]
    search_fields = ["message_type", "portfolio"]
