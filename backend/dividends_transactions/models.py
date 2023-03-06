from companies.models import Company
from django.db import models
from shares_transactions.models import Transaction


class DividendsTransaction(Transaction):
    company_id: int
    company = models.ForeignKey["Company"](Company, on_delete=models.CASCADE, related_name="dividends_transactions")

    class Meta:
        ordering = ["-transaction_date"]
        verbose_name = "Dividends Transaction"
        verbose_name_plural = "Dividends Transactions"
