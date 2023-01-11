import logging
from datetime import datetime
import time
import yfinance as yf

from stock_prices.services.stock_price_service_base import StockPriceServiceBase

logger = logging.getLogger("buho_backend")


class YFinanceApiClient(StockPriceServiceBase):
    def __init__(self, wait_time=2):
        self.wait_time = wait_time

    def get_historical_data(self, ticker: str, start_date: str, end_date: str) -> list:
        prices = []
        time.sleep(self.wait_time)

        results, currency = self.request_from_api(ticker, start_date, end_date)

        if results is None:
            return []

        for price_date in results:
            try:
                element_values = results[price_date]
                price = element_values["Close"]
                if not currency:
                    break
                if currency.upper() == "GBP":
                    price = price / 100
                    currency = "GBP"

                price = round(price, 3)
                converted_date = price_date.to_pydatetime().date()
                formatted_date = converted_date.strftime("%Y-%m-%d")
                transaction_date = formatted_date
                data = {
                    "price": price,
                    "price_currency": currency,
                    "ticker": ticker,
                    "transaction_date": transaction_date,
                }
                prices.append(data)

            except (KeyError, TypeError) as error:
                logger.warning(
                    f"{ticker}: close or date fields not found: {error}. Skipping."
                )

        prices.sort(key=lambda x: x["transaction_date"], reverse=False)
        return prices

    def request_from_api(self, ticker: str, from_date: str, to_date: str):

        result = yf.download(ticker, start=from_date, end=to_date)
        # {
        # Timestamp('2022-12-30 00:00:00'): {
        #   'Open': 128.41000366210938,
        #   'High': 129.9499969482422,
        #   'Low': 127.43000030517578,
        #   'Close': 129.92999267578125,
        #   'Adj Close': 129.92999267578125,
        #   'Volume': 76960600
        #   }
        # }

        try:
            company = yf.Ticker(ticker)
            currency = company.info["currency"]

            result = result.sort_values("Date", ascending=False)
            dates_dict = result.to_dict("index")

            return dates_dict, currency

        except (IndexError, TypeError) as error:
            logger.warning(f"{ticker}: IndexError: {error}. Skipping.")
            return None, None
