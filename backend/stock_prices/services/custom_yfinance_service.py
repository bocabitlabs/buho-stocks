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
        logger.debug(f"Get historical data for {ticker} from {start_date} to {end_date}")
        time.sleep(self.wait_time)

        results, currency = self.request_from_api(ticker, start_date, end_date)

        for row in results:
            try:
                price = row["close"]
                logger.debug(f"Got price {price} in currency {currency}")
                # price = price.replace(",", "")
                if currency.upper() == "GBP":
                    price = price / 100
                    currency = "GBP"

                price = round(price, 3)
                row_date = datetime.fromtimestamp(row["date"]).strftime("%Y-%m-%d")
                transaction_date = row_date


                logger.debug(f"{ticker}: Got price {price} ({currency}) for {transaction_date}")
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

    def request_from_api(self, ticker, from_date, to_date):
        # Convert from_date to datetime
        logger.debug(f"Requesting historical data for {ticker} from {from_date} to {to_date}")
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
        result = json.loads(
            data.text.split('HistoricalPriceStore":{"prices":')[1].split(',"isPending')[
                0
            ]
        )
        currency_search = re.search("Currency in (\w+)\<\/span\>", response.text)
        currency = currency_search.group(1)

        return result, currency