from django.db import models

from portfolios.models import Portfolio


class LogMessage(models.Model):
    id = models.AutoField(primary_key=True)
    MESSAGE_TYPE_CREATE_COMPANY = "CREATE_COMPANY"
    MESSAGE_TYPE_DELETE_COMPANY = "DELETE_COMPANY"

    MESSAGE_TYPE_ADD_DIVIDEND = "ADD_DIVIDEND"
    MESSAGE_TYPE_DELETE_DIVIDEND = "DELETE_DIVIDEND"

    MESSAGE_TYPE_ADD_SHARES = "ADD_SHARES"
    MESSAGE_TYPE_DELETE_SHARES = "DELETE_SHARES"

    MESSAGE_TYPE_ADD_RIGHTS = "ADD_RIGHTS"
    MESSAGE_TYPE_DELETE_RIGHTS = "DELETE_RIGHTS"

    MESSAGE_TYPE_ADD_PRICE = "ADD_PRICE"
    MESSAGE_TYPE_DELETE_PRICE = "DELETE_PRICE"

    message_text = models.CharField(max_length=400)
    message_type = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name="log_messages")

    class Meta:
        verbose_name = "Log Message"
        verbose_name_plural = "Log Messages"

    def __str__(self):
        return f"{self.message_type} - {self.date_created}: {self.message_text}"
