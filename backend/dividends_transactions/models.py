from django.db import models
from django.db.models.query import QuerySet
from djmoney.models.fields import MoneyField

from companies.models import Company
from shares_transactions.models import Transaction


class DividendsTransaction(Transaction):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="dividends_transactions"
    )
    total_amount = MoneyField(
        max_digits=12, decimal_places=3, default=0, default_currency="EUR"
    )

    objects: QuerySet["DividendsTransaction"]  # To solve issue django-manager-missing

    class Meta:
        ordering = ["-transaction_date"]
        verbose_name = "Dividends Transaction"
        verbose_name_plural = "Dividends Transactions"

    def __str__(self):
        return (
            f"Amount: {self.total_amount} - PPS: {self.gross_price_per_share} "
            f"- Commission: {self.total_commission}"
        )
