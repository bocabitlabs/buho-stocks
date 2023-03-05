import datetime
import logging

from buho_backend.transaction_types import TransactionType
from companies.models import Company
from django.db import models
from djmoney.models.fields import MoneyField
from rest_framework import serializers

logger = logging.getLogger("buho_backend")


class Transaction(models.Model):
    count = models.IntegerField()
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=3)
    transaction_date = models.DateField()
    gross_price_per_share = MoneyField(max_digits=12, decimal_places=3)
    total_commission = MoneyField(max_digits=12, decimal_places=3)
    notes = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.count} - {self.gross_price_per_share} - {self.total_commission}"

    def clean(self):
        # Transaction cannot be in the future
        if self.transaction_date > datetime.date.today():
            logger.debug(f"Clean called: {self.transaction_date}")
            raise serializers.ValidationError(
                {"transaction_date": "Transaction cannot be created in the future"}, code="invalid"
            )


class SharesTransaction(Transaction):
    type = models.CharField(choices=TransactionType.choices, default=TransactionType.BUY, max_length=10)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="shares_transactions")

    def __str___(self):
        return f"{self.type} - {self.count} - {self.gross_price_per_share} ({self.total_commission}"

    class Meta:
        ordering = ["-transaction_date"]
