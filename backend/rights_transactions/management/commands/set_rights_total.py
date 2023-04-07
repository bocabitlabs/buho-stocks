import logging

from django.core.management.base import BaseCommand
from rights_transactions.models import RightsTransaction

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Set the rights total amount for all the shares transactions"

    def handle(self, *args, **options):
        self.stdout.write("Updating total amount for rights transactions")
        # Iterate all the dividends transactions and set the total amount
        for transaction in RightsTransaction.objects.all():
            transaction.total_amount = transaction.count * transaction.gross_price_per_share
            transaction.save()
        self.stdout.write("Updating total amount currency for rights transactions")
        # Iterate all the dividends transactions and set the total amount currency to the company dividends currency
        for transaction in RightsTransaction.objects.all():
            transaction.total_amount.currency = transaction.company.base_currency
            transaction.save()

        self.stdout.write(self.style.SUCCESS("Successfully set the rights total amount"))
