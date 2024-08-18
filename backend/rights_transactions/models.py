from django.db import models
from django.db.models.query import QuerySet
from djmoney.models.fields import MoneyField

from buho_backend.transaction_types import TransactionType
from companies.models import Company
from shares_transactions.models import Transaction


class RightsTransaction(Transaction):
    type: models.CharField = models.CharField(
        choices=TransactionType.choices,
        default=TransactionType.BUY,
        max_length=10,
        verbose_name="Type",
    )
    total_amount = MoneyField(
        max_digits=12, decimal_places=3, default=0, default_currency="EUR"
    )

    company: models.ForeignKey = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="rights_transactions"
    )
    objects: QuerySet["RightsTransaction"]  # To solve issue django-manager-missing

    def __str___(self):
        return (
            f"{self.type} - {self.count} - "
            f"{self.gross_price_per_share} ({self.total_commission}"
        )

    class Meta:
        ordering = ["-transaction_date"]
