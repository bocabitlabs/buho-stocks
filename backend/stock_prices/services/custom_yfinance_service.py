from datetime import datetime
import json
import re
import time
import requests
import yfinance
import logging
from stock_prices.services.service_base import StockPriceServiceBase

logger = logging.getLogger("buho_backend")


class CustomYFinanceService(StockPriceServiceBase):
    def __init__(self, wait_time=2):
        self.wait_time = wait_time

    def get_current_data(self, ticker: str):
        time.sleep(self.wait_time)
        company = yfinance.Ticker(ticker)
        company_info = company.info

        price = round(company_info["regularMarketPrice"], 3)
        if company_info["currency"] == "GBP":
            price = price / 100

        return {
            "company_name": company_info["shortName"],
            "price": price,
            "price_currency": company_info["currency"],
            "ticker": ticker,
            "transaction_date": datetime.now().strftime("%Y-%m-%d"),
        }

    def get_historical_data(self, ticker: str, start_date: str, end_date: str):
        prices = []
        time.sleep(self.wait_time)

        results, currency = self.request_from_api(ticker, start_date, end_date)

        if results is None:
            return []

        for row in results:
            try:
                price = row["close"]
                if currency.upper() == "GBP":
                    price = price / 100
                    currency = "GBP"

                price = round(price, 3)
                row_date = datetime.fromtimestamp(row["date"]).strftime("%Y-%m-%d")
                transaction_date = row_date

                data = {
                    "price": price,
                    "price_currency": currency,
                    "ticker": ticker,
                    "transaction_date": transaction_date,
                }
                prices.append(data)
            except (KeyError,TypeError) as error:
                logger.warning(f"{ticker}: KeyError: {error}. Skipping.")
        prices.sort(key=lambda x: x["transaction_date"], reverse=False)

        return prices

    def request_from_api(self, ticker: str, from_date: str, to_date: str):
        # Convert from_date to datetime
        from_date_datetime = datetime.strptime(from_date, "%Y-%m-%d")
        # Convert to_date to datetime
        to_date_datetime = datetime.strptime(to_date, "%Y-%m-%d")
        # Get utc timestamp for from_date
        from_date_timestamp = int(from_date_datetime.timestamp())
        to_date_timestamp = int(to_date_datetime.timestamp())
        base_url = "https://finance.yahoo.com/quote/"
        path = f"{base_url}{ticker}/history?period1={from_date_timestamp}&period2={to_date_timestamp}&interval=1d&filter=history&frequency=1d"
        response = requests.get(
            path,
            headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux i686; rv:95.0) Gecko/20100101 Firefox/95.0"
            },
        )
        data = response
        try:
            result = json.loads(
                data.text.split('HistoricalPriceStore":{"prices":')[1].split(',"isPending')[
                    0
                ]
            )
            currency_search = re.search("Currency in (\w+)\<\/span\>", response.text)
            currency = currency_search.group(1)
        except (IndexError, TypeError) as error:
            logger.warning(f"{ticker}: IndexError: {error}. Skipping.")
            return None, None

        return result, currency