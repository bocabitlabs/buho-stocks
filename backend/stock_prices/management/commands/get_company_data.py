import logging

from django.core.management.base import BaseCommand

from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Gets the stock prices of a given ticker for a period of time"

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str)
        parser.add_argument("from", type=str, help="Start date in format YYYY-MM-DD")
        parser.add_argument("to", type=str, help="End date in format YYYY-MM-DD")

    def handle(self, *args, **options):
        ticker = options["ticker"]
        from_date = options["from"]
        to_date = options["to"]

        self.stdout.write(f"Getting data for {ticker}")

        api_client = YFinanceApiClient()
        currency = api_client.get_company_data_between_dates(ticker, from_date, to_date)

        self.stdout.write(self.style.SUCCESS(f"{ticker} Data: {currency}"))
