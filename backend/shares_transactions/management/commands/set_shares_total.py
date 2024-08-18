import logging

from django.core.management.base import BaseCommand

from shares_transactions.models import SharesTransaction

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Set the shares total amount for all the shares transactions"

    def handle(self, *args, **options):
        self.stdout.write("Updating total amount for shares transactions")
        # Iterate all the dividends transactions and set the total amount
        for transaction in SharesTransaction.objects.all():
            transaction.total_amount = (
                transaction.count * transaction.gross_price_per_share
            )
            transaction.save()
        self.stdout.write("Updating total amount currency for shares transactions")
        # Iterate all the dividends transactions and set the total amount currency
        # to the company dividends currency
        for transaction in SharesTransaction.objects.all():
            transaction.total_amount.currency = transaction.company.base_currency
            transaction.save()

        self.stdout.write(
            self.style.SUCCESS("Successfully set the shares total amount")
        )
