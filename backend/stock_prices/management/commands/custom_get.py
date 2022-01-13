import datetime
import json
import logging
import re
from django.core.management.base import BaseCommand
import requests
import logging
from stock_prices.api import StockPricesApi

logger = logging.getLogger("buho_backend")


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
            f"Getting custom data for {ticker} from {from_date} to {to_date}. (only_api={only_api}, dry_run={dry_run})"
        )

        # Convert from_date to datetime
        from_date_datetime = datetime.datetime.strptime(from_date, "%Y-%m-%d")
        # Convert to_date to datetime
        to_date_datetime = datetime.datetime.strptime(to_date, "%Y-%m-%d")
        # Get utc timestamp for from_date
        from_date_timestamp = int(from_date_datetime.timestamp())
        to_date_timestamp = int(to_date_datetime.timestamp())
        base_url = "https://finance.yahoo.com/quote/"
        path = f"{base_url}{ticker}/history?period1={from_date_timestamp}&period2={to_date_timestamp}&interval=1d&filter=history&frequency=1d"
        self.stdout.write(f"Requesting {path}")
        response = requests.get(
            path,
            headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux i686; rv:95.0) Gecko/20100101 Firefox/95.0"
            },
        )
        data = response
        result = json.loads(
            data.text.split('HistoricalPriceStore":{"prices":')[1].split(',"isPending')[
                0
            ]
        )
        logger.debug(f"Got {len(result)} rows")
        logger.debug(result)
        for row in result:
            row_date = datetime.datetime.fromtimestamp(row["date"]).strftime("%Y-%m-%d")
            row["date"] = row_date
            row_close = row["close"]

            logger.debug(f"{row_date} - {row_close}")

        result = re.search("Currency in (\w+)\<\/span\>", response.text)
        logger.debug(f"Got {result.group(1)}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully got historical data for {ticker} ({from_date}/{to_date})"
            )
        )
        # self.stdout.write(self.style.SUCCESS(response.text))
        self.stdout.write(self.style.SUCCESS(data))
