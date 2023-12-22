import logging

from django.core.management.base import BaseCommand

from initialize_data.initializers.markets import create_initial_markets

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Add the initial markets on the database"

    def handle(self, *args, **options):
        self.stdout.write("Adding initial markets to the database")

        markets = create_initial_markets()

        self.stdout.write(self.style.SUCCESS(f"Created {len(markets)}{[market.name for market in markets]}"))
