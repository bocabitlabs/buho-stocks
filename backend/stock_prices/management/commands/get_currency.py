import logging

from django.core.management.base import BaseCommand
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Gets the currency of a given ticker"

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str)

    def handle(self, *args, **options):
        ticker = options["ticker"]

        self.stdout.write(f"Getting currency for {ticker}")

        api_client = YFinanceApiClient()
        currency = api_client.get_company_currency(ticker)

        self.stdout.write(self.style.SUCCESS(f"{ticker} currency: {currency}"))
