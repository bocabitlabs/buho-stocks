from django.db import models
from companies.models import Company
from shares_transactions.models import Transaction


class DividendsTransaction(Transaction):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="dividends_transactions"
    )
