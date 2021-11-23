from django.db import models
from companies.models import Company
from shares_transactions.models import Transaction


class RightsTransaction(Transaction):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="rights_transactions"
    )
