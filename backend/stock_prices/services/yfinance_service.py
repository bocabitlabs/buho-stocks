from datetime import datetime
import time
import yfinance
import logging
from stock_prices.services.service_base import StockPriceServiceBase

logger = logging.getLogger("buho_backend")


class YFinanceStockPricesService(StockPriceServiceBase):
    def __init__(self):
        pass

    def get_current_data(self, ticker: str):
        time.sleep(2)
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
        logger.debug(f"Get current data for {ticker} from {start_date} to {end_date}")
        company = yfinance.Ticker(ticker)
        time.sleep(2)
        company_info = self.get_current_data(ticker)
        logger.debug(
            f"Get historical data for {ticker} from {start_date} to {end_date}"
        )
        time.sleep(2)
        result = company.history(
            start=start_date, end=end_date, period="1d", timeout=10
        )
        logger.debug(result)
        # print(type(result))
        # print(result)
        for col, row in result.iterrows():
            # result += max(row.B, row.C)
            # print(element)
            # print(col)
            try:
                price = round(row["Close"], 3)
                if company_info["price_currency"] == "GBP":
                    price = price / 100

                data = {
                    "company_name": company_info["company_name"],
                    "price": price,
                    "price_currency": company_info["price_currency"],
                    "ticker": ticker,
                    "transaction_date": col.to_pydatetime().strftime("%Y-%m-%d"),
                }
                prices.append(data)
                logger.debug(f"Added {ticker} data {data}")
            except KeyError as error:
                logger.warning(
                    f"Unable to append data for {ticker}. KeyError: {str(error)}"
                )
        logger.debug(f"Found {len(prices)} historical prices")
        return prices
