import logging

from django.core.management.base import BaseCommand

from exchange_rates.services.yfinance_api_client import YFinanceExchangeClient

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Gets the exchange rate of a given ticker"

    def add_arguments(self, parser):
        parser.add_argument("from_currency", type=str)
        parser.add_argument("to_currency", type=str)
        parser.add_argument("date", type=str, help="Date in format YYYY-MM-DD")

    def handle(self, *args, **options):
        from_currency = options["from_currency"]
        to_currency = options["to_currency"]
        used_date = options["date"]

        self.stdout.write(f"Getting data for {from_currency} to {to_currency} on {used_date}")

        api_client = YFinanceExchangeClient()
        currency = api_client.get_exchange_rate_for_date(from_currency, to_currency, used_date)

        self.stdout.write(self.style.SUCCESS(f"{used_date} Data: {currency}"))
