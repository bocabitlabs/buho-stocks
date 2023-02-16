import datetime
import logging
from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer
from stock_prices.services.stock_price_service_base import StockPriceServiceBase

logger = logging.getLogger("buho_backend")


class StockPricesApi:
    def __init__(
        self,
        stock_prices_service: StockPriceServiceBase,
    ):
        self.stock_prices_service = stock_prices_service

    def get_historical_data(
        self,
        ticker: str,
        from_date: str,
        to_date: str,
        minimum_values: int = None,
        only_api=False,
        dry_run=False,
    ) -> dict:
        """Get the historical prices for a given ticker and range of dates.

        Args:
            ticker (str): Ticker of the company
            from_date (str): Start date of the range
            to_date (str): End date of the range
            minimum_values (int, optional): Minimum values to retrieve. Defaults to None.

        Returns:
            dict: [description]
        """
        logger.info(
            f"Getting historical data for {ticker} from {from_date} to {to_date}. only_api={only_api}, dry_run={dry_run} )"
        )
        if only_api:
            prices_length = 0
        else:
            prices = StockPrice.objects.filter(
                ticker=ticker, transaction_date__range=[from_date, to_date]
            )

            from_datetime = datetime.date.fromisoformat(from_date)
            to_datetime = datetime.date.fromisoformat(to_date)

            delta = to_datetime - from_datetime
            prices_length = len(prices)

            if minimum_values is None:
                minimum_values = delta.days / 2 - 1
        if prices_length < minimum_values:
            logger.info(
                f"No historical data found locally for {ticker} on those dates. Searching remote."
            )
            prices = self.stock_prices_service.get_historical_data(
                ticker, from_date, to_date
            )
            if len(prices) > 0:
                logger.info(f"Found {len(prices)} prices for {ticker} in the remote.")
            for price in prices:
                serialized_date = price.get("transaction_date", "unknown")
                try:
                    price_instance = StockPrice.objects.get(
                        ticker=ticker, transaction_date=serialized_date
                    )
                except StockPrice.DoesNotExist:
                    price_instance = None
                if price_instance is not None:
                    serializer = StockPriceSerializer(price_instance, data=price)
                else:
                    serializer = StockPriceSerializer(data=price)

                if serializer.is_valid():
                    if not dry_run:
                        serializer.save()
                    else:
                        logger.debug("Dry run. Not saving element.")
                else:
                    logger.debug(
                        f"{ticker} - {serialized_date}. Error on price :{serializer.errors}"
                    )
            serializer = StockPriceSerializer(instance=prices, many=True)
            return serializer.data
        else:
            serializer = StockPriceSerializer(instance=prices, many=True)
            return serializer.data

    def get_last_data_from_year(self, ticker: str, year: int, only_api=False) -> dict:
        from_date, to_date = self.get_start_end_dates_for_year(year)
        results = self.get_historical_data(
            ticker, from_date, to_date, minimum_values=1, only_api=only_api
        )
        if len(results) > 0:
            return results[-1]

    def get_start_end_dates_for_year(self, year: int):
        todays_date = datetime.date.today()
        if todays_date.year == int(year):
            # Get today minus 15 days
            from_date = (todays_date - datetime.timedelta(days=15)).strftime("%Y-%m-%d")
            to_date = todays_date.strftime("%Y-%m-%d")
        else:
            from_date = f"{year}-12-01"
            to_date = f"{year}-12-31"
        return from_date, to_date

    def get_last_data_from_last_month(self, ticker: str) -> dict:
        from_date = (datetime.date.today() - datetime.timedelta(days=31)).strftime(
            "%Y-%m-%d"
        )
        to_date = datetime.date.today().strftime("%Y-%m-%d")
        results = self.get_historical_data(ticker, from_date, to_date, minimum_values=1)
        if len(results) > 0:
            return results[-1]
