import datetime
import logging
from typing import Optional, Union

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
        minimum_values: Optional[int] = None,
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
            (
                f"Getting historical data for {ticker} "
                f"from {from_date} to {to_date}. only_api={only_api}, dry_run={dry_run} )"
            )
        )

        from_datetime = datetime.date.fromisoformat(from_date)
        to_datetime = datetime.date.fromisoformat(to_date)

        prices = StockPrice.objects.filter(ticker=ticker, transaction_date__range=[from_date, to_date])

        delta = to_datetime - from_datetime
        prices_length = len(prices)

        if minimum_values is None:
            minimum_values = int(delta.days / 2 - 1)
            if minimum_values <= 0:
                minimum_values = 1

        if only_api:
            prices_length = 0

        if prices_length < minimum_values:
            logger.info(f"No historical data found locally for {ticker} on those dates. Searching remote.")
            prices = self.stock_prices_service.get_stock_prices_list(ticker, from_date, to_date)
            if len(prices) > 0:
                logger.info(f"Found {len(prices)} prices for {ticker} in the remote.")
            for price in prices:
                serialized_date = price["transaction_date"]
                try:
                    price_instance = StockPrice.objects.get(ticker=ticker, transaction_date=serialized_date)

                    serializer = StockPriceSerializer(price_instance, data=price)  # type: ignore
                    if serializer and serializer.is_valid():
                        if not dry_run:
                            serializer.save()
                            logger.debug(f"Saving price for {ticker} on {serialized_date}: {serializer.data}")
                        else:
                            logger.debug("Dry run. Not saving element.")

                except StockPrice.DoesNotExist:
                    price_instance = None
                    serializer = StockPriceSerializer(data=price)  # type: ignore

                    if serializer and serializer.is_valid():
                        if not dry_run:
                            serializer.save()
                            logger.debug(f"Saving price for {ticker} on {serialized_date}: {serializer.data}")
                        else:
                            logger.debug("Dry run. Not saving element.")
                    else:
                        logger.debug(f"{ticker} - {serialized_date}. Error on price :{serializer.errors}")
            serializer = StockPriceSerializer(instance=prices, many=True)
            return serializer.data
        else:
            serializer = StockPriceSerializer(instance=prices, many=True)
            return serializer.data

    def get_last_data_from_year(self, ticker: str, year: int, only_api=False) -> Union[dict, None]:
        from_date, to_date = self.get_start_end_dates_for_year(year)
        results = self.get_historical_data(ticker, from_date, to_date, minimum_values=1, only_api=only_api)
        if len(results) > 0:
            return results[-1]
        return None

    def get_start_end_dates_for_year(self, year: int) -> tuple[str, str]:
        todays_date = datetime.date.today()
        if todays_date.year == int(year):
            # Get today minus 15 days
            from_date = (todays_date - datetime.timedelta(days=15)).strftime("%Y-%m-%d")
            to_date = todays_date.strftime("%Y-%m-%d")
        else:
            from_date = f"{year}-12-01"
            to_date = f"{year}-12-31"
        return from_date, to_date

    def get_last_data_from_last_month(self, ticker: str) -> Union[dict, None]:
        from_date = (datetime.date.today() - datetime.timedelta(days=31)).strftime("%Y-%m-%d")
        to_date = datetime.date.today().strftime("%Y-%m-%d")
        results = self.get_historical_data(ticker, from_date, to_date, minimum_values=1)
        if len(results) > 0:
            return results[-1]
        return None
