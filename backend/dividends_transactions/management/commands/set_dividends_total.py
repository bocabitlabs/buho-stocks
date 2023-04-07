import logging

from dividends_transactions.models import DividendsTransaction
from django.core.management.base import BaseCommand

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Set the dividends total amount for all the dividends transactions"

    def handle(self, *args, **options):
        self.stdout.write("Updating total amount for dividends transactions")
        # Iterate all the dividends transactions and set the total amount
        for dividends_transaction in DividendsTransaction.objects.all():
            dividends_transaction.total_amount = (
                dividends_transaction.count * dividends_transaction.gross_price_per_share
            )
            dividends_transaction.save()
        self.stdout.write("Updating total amount currency for dividends transactions")
        # Iterate all the dividends transactions and set the total amount currency to the company dividends currency
        for dividends_transaction in DividendsTransaction.objects.all():
            dividends_transaction.total_amount.currency = dividends_transaction.company.dividends_currency
            dividends_transaction.save()

        self.stdout.write(self.style.SUCCESS("Successfully set the dividends total amount"))
