from django.contrib.auth.models import User
from django.db import models

from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from portfolios.models import Portfolio


class LogMessage(models.Model):
    message_text = models.CharField(max_length=200)
    message_type = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name="log_messages"
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return f"{self.message_type} - {self.date_created}: {self.message_text}"
