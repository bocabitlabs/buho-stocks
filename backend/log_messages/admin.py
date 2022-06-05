from django.contrib import admin
from log_messages.models import LogMessage
from buho_backend.admin import BaseAdmin

# Register your models here.
@admin.register(LogMessage)
class LogMessageAdmin(BaseAdmin):
    list_display = ['id', 'message_type', 'portfolio_link', 'user_link', 'date_created']
    search_fields = ['message_type', 'portfolio', 'user']
    list_filter = ['user']
