import datetime
import logging
from typing import List

from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer
from stock_prices.services.yfinance_api_client import YFinanceApiClient

logger = logging.getLogger("buho_backend")


class StockPricesService:
    def __init__(
        self,
    ):
        self.api_client = YFinanceApiClient()

    def get_last_data_from_year(
        self,
        ticker: str,
        from_date: datetime.datetime,
        to_date: datetime.datetime,
        update_api_price=False,
    ) -> StockPrice | None:
        # logger.debug(f"Getting last data from year {year} for {ticker}")
        from_date_str = from_date.strftime("%Y-%m-%d")
        to_date_str = to_date.strftime("%Y-%m-%d")
        results = self._get_historical_data(
            ticker, from_date_str, to_date_str, update_api_price=update_api_price
        )
        if len(results) > 0:
            return results[-1]
        return None

    def get_last_data_from_last_month(self, ticker: str) -> StockPrice | None:
        logger.debug(f"Getting last data from last month for {ticker}")
        from_date = (datetime.date.today() - datetime.timedelta(days=31)).strftime(
            "%Y-%m-%d"
        )
        to_date = datetime.date.today().strftime("%Y-%m-%d")
        results = self._get_historical_data(ticker, from_date, to_date)
        if len(results) > 0:
            return results[1]
        return None

    def _get_historical_data(
        self,
        ticker: str,
        from_date: str,
        to_date: str,
        update_api_price=False,
        dry_run=False,
    ) -> List[StockPrice]:
        """Get the historical prices for a given ticker and range of dates.

        Args:
            ticker (str): Ticker of the company
            from_date (str): Start date of the range
            to_date (str): End date of the range

        Returns:
            dict: [description]
        """

        prices = StockPrice.objects.filter(
            ticker=ticker, transaction_date__range=[from_date, to_date]
        )
        prices_length = prices.count()
        logger.debug(
            f"Found {prices_length} stock prices locally for {ticker} "
            f"between {from_date} and {to_date}"
        )

        if update_api_price:
            logger.debug(
                f"Updating from API stock prices for {ticker} "
                f"between {from_date} and {to_date}"
            )
            prices_length = 0

        instances: List[StockPrice] = []
        if prices_length < 1:
            prices_from_api = self.api_client.get_stock_prices_list(
                ticker, from_date, to_date
            )

            if len(prices_from_api) > 0:
                logger.info(f"Found {len(prices)} prices for {ticker} in the remote.")
            for price in prices_from_api:
                serialized_date = price["transaction_date"]
                try:
                    price_instance = StockPrice.objects.get(
                        ticker=ticker, transaction_date=serialized_date
                    )

                    serializer = StockPriceSerializer(price_instance, data=price)
                    if serializer and serializer.is_valid():
                        if not dry_run:
                            instance = serializer.save()
                            instances.append(instance)
                            logger.debug(
                                f"Saving price for {ticker} on {serialized_date}: "
                                f"{serializer.data}"
                            )
                        else:
                            logger.debug("Dry run. Not saving element.")

                except StockPrice.DoesNotExist:
                    price_instance = None
                    serializer = StockPriceSerializer(data=price)  # type: ignore

                    if serializer and serializer.is_valid():
                        if not dry_run:
                            instance = serializer.save()
                            instances.append(instance)
                            logger.debug(
                                f"Saving price for {ticker} on {serialized_date}: "
                                f"{serializer.data}"
                            )
                        else:
                            logger.debug("Dry run. Not saving element.")
                    else:
                        logger.debug(
                            f"{ticker} - {serialized_date}. "
                            f"Error on price :{serializer.errors}"
                        )
            return instances
        else:
            instances = list(prices.all())
            return instances
