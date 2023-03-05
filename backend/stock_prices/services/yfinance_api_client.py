import logging
import time
from typing import Any, Tuple, TypedDict

import yfinance as yf
from pandas import Timestamp
from stock_prices.services.stock_price_service_base import StockPriceServiceBase, TypedStockPrice

logger = logging.getLogger("buho_backend")


class TypedYFinanceStockPrice(TypedDict):
    Open: float
    High: float
    Low: float
    Close: float
    Volume: int


class YFinanceApiClient(StockPriceServiceBase):
    def __init__(self, wait_time=2):
        self.wait_time = wait_time

    def get_stock_prices_list(self, ticker: str, start_date: str, end_date: str) -> list[TypedStockPrice]:
        prices = []
        time.sleep(self.wait_time)

        results, currency = self.get_company_data_between_dates(ticker, start_date, end_date)

        if results is None:
            return []

        for price_date in results:
            try:
                if not currency:
                    break
                element_values = results[price_date]
                data = self.get_formatted_price_dict(ticker, currency, price_date, element_values)
                prices.append(data)

            except (KeyError, TypeError) as error:
                logger.warning(f"{ticker}: close or date fields not found: {error}. Skipping.")

        prices.sort(key=lambda x: x["transaction_date"], reverse=False)
        return prices

    def get_formatted_price_dict(
        self, ticker: str, currency: str, price_date: Timestamp, element_values: TypedYFinanceStockPrice
    ) -> TypedStockPrice:
        price = element_values["Close"]
        if currency == "GBP":
            price = self.convert_price_to_gbp(price)

        price = round(price, 3)
        converted_date = price_date.to_pydatetime().date()
        formatted_date = converted_date.strftime("%Y-%m-%d")
        transaction_date = formatted_date
        data: TypedStockPrice = {
            "price": price,
            "price_currency": currency,
            "ticker": ticker,
            "transaction_date": transaction_date,
        }

        return data

    def convert_price_to_gbp(self, price):
        price = price / 100
        return price

    def get_company_currency(self, ticker: str) -> str:
        company = yf.Ticker(ticker)
        currency = company.fast_info["currency"]
        currency = currency.upper()
        logger.info(f"{ticker} currency: {currency}")
        return currency

    def convert_api_data_to_dict(self, api_data: Any) -> dict | None:
        result = api_data.sort_values("Date", ascending=False)
        dates_dict = result.to_dict("index")
        if dates_dict == {}:
            dates_dict = None
        return dates_dict

    def get_company_data_between_dates(
        self, ticker: str, from_date: str, to_date: str
    ) -> tuple[dict[Timestamp, TypedYFinanceStockPrice] | None, str] | Tuple[None, None]:
        currency = self.get_company_currency(ticker)
        result = yf.download(ticker, start=from_date, end=to_date)

        try:
            result_as_dict = self.convert_api_data_to_dict(result)
            logger.info(f"{ticker} dates returned from API {result_as_dict}")
            return result_as_dict, currency

        except (IndexError, TypeError) as error:
            logger.warning(f"{ticker}: Error: {error}. Skipping.")
            return None, None
