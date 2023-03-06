from buho_backend.transaction_types import TransactionType
from companies.models import Company
from django.db import models
from shares_transactions.models import Transaction


class RightsTransaction(Transaction):
    type: models.CharField = models.CharField(
        choices=TransactionType.choices, default=TransactionType.BUY, max_length=10, verbose_name="Type"
    )
    company: models.ForeignKey = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="rights_transactions"
    )

    def __str___(self):
        return f"{self.type} - {self.count} - {self.gross_price_per_share} ({self.total_commission}"

    class Meta:
        ordering = ["-transaction_date"]
