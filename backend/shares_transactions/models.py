from django.contrib.auth.models import User
from django.db import models
from buho_backend.transaction_types import TransactionType
from companies.models import Company
from djmoney.models.fields import MoneyField


class Transaction(models.Model):
    class Meta:
        abstract = True

    count = models.IntegerField()
    color = models.CharField(max_length=200)
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=3)
    transaction_date = models.DateField()
    gross_price_per_share = MoneyField(
        max_digits=12, decimal_places=3, default_currency=None
    )
    total_commission = MoneyField(
        max_digits=12, decimal_places=3, default_currency=None
    )
    notes = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)

    def __str___(self):
        return f"{self.count} - {self.gross_price_per_share} - {self.total_commission}"


class SharesTransaction(Transaction):
    type = models.CharField(
        choices=TransactionType.choices, default=TransactionType.BUY, max_length=10
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="shares_transactions"
    )

    def __str___(self):
        return f"{self.type} - {self.count} - {self.gross_price_per_share} ({self.total_commission}"
