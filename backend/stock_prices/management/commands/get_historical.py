from django.core.management.base import BaseCommand
from stock_prices.api import StockPricesApi

from stock_prices.services.yfinance_service import YFinanceStockPricesService


class Command(BaseCommand):
    help = "Gets historical stock prices for a given period"

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str)
        parser.add_argument("from_date", type=str)
        parser.add_argument("to_date", type=str)
        parser.add_argument("only_api", type=bool)
        parser.add_argument("dry_run", type=bool)

    def handle(self, *args, **options):
        ticker = options["ticker"]
        from_date = options["from_date"]
        to_date = options["to_date"]
        only_api = options["only_api"]
        dry_run = options["dry_run"]

        self.stdout.write(
            f"Getting historical data for {ticker} from {from_date} to {to_date}. (only_api={only_api}, dry_run={dry_run})"
        )
        yfinance = YFinanceStockPricesService()
        api = StockPricesApi(yfinance)
        data = api.get_historical_data(
            ticker, from_date, to_date, 1, only_api=only_api, dry_run=dry_run
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully got historical data for {ticker} ({from_date}/{to_date})"
            )
        )
        self.stdout.write(self.style.SUCCESS(data))
