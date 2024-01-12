import datetime
import logging

from django.db import models
from django.db.models.query import QuerySet
from django_stubs_ext.db.models import TypedModelMeta
from djmoney.models.fields import MoneyField
from moneyed import Money
from rest_framework import serializers

from buho_backend.transaction_types import TransactionType
from companies.models import Company

logger = logging.getLogger("buho_backend")


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    count = models.IntegerField(default=0)
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=3)
    transaction_date = models.DateField()
    gross_price_per_share = MoneyField(
        max_digits=12, decimal_places=3, default=Money("0", "USD")
    )
    total_amount = MoneyField(max_digits=12, decimal_places=3)
    total_commission = MoneyField(max_digits=12, decimal_places=3)
    notes = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self):
        return f"{self.count} - {self.gross_price_per_share} - {self.total_commission}"

    def clean(self):
        # Transaction cannot be in the future
        if self.transaction_date > datetime.date.today():
            logger.debug(f"Clean called: {self.transaction_date}")
            raise serializers.ValidationError(
                {"transaction_date": "Transaction cannot be created in the future"},
                code="invalid",
            )


class SharesTransaction(Transaction):
    type = models.CharField(
        choices=TransactionType.choices, default=TransactionType.BUY, max_length=10
    )
    total_amount = MoneyField(
        max_digits=12, decimal_places=3, default=0, default_currency="EUR"
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="shares_transactions"
    )

    objects: QuerySet["SharesTransaction"]  # To solve issue django-manager-missing

    class Meta(TypedModelMeta):
        ordering = ["-transaction_date"]
        verbose_name = "Shares Transaction"
        verbose_name_plural = "Shares Transactions"

    def __str__(self):
        return (
            f"{self.type} - {self.count} - "
            f"{self.gross_price_per_share} ({self.total_commission}"
        )
