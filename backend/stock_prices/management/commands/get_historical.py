from django.core.management.base import BaseCommand
from stock_prices.api import StockPricesApi

from stock_prices.services.yfinance_service import YFinanceStockPricesService


class Command(BaseCommand):
    help = "Gets historical stock prices for a given period"

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str)
        parser.add_argument("from_date", type=str)
        parser.add_argument("to_date", type=str)

    def handle(self, *args, **options):
        ticker = options["ticker"]
        from_date = options["from_date"]
        to_date = options["to_date"]

        yfinance = YFinanceStockPricesService()
        api = StockPricesApi(yfinance)
        data = api.get_historical_data(ticker, from_date, to_date)
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully got historical data for {ticker} ({from_date}/{to_date})"
            )
        )
        self.stdout.write(self.style.SUCCESS(data))
