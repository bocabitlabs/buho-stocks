from django.db import models
from djmoney.models.fields import MoneyField

from companies.models import Company
from shares_transactions.models import Transaction


class DividendsTransaction(Transaction):
    company_id: int
    company = models.ForeignKey["Company"](Company, on_delete=models.CASCADE, related_name="dividends_transactions")
    total_amount = MoneyField(max_digits=12, decimal_places=3, default=0, default_currency="EUR")  # type: ignore

    class Meta:
        ordering = ["-transaction_date"]
        verbose_name = "Dividends Transaction"
        verbose_name_plural = "Dividends Transactions"

    def __str__(self):
        return f"Amount: {self.total_amount} - PPS: {self.gross_price_per_share} - Commission: {self.total_commission}"
