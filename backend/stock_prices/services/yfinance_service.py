from datetime import datetime
import yfinance
from stock_prices.services.service_base import StockPriceServiceBase


class YFinanceStockPricesService(StockPriceServiceBase):
    def __init__(self):
        pass

    def get_current_data(self, ticker: str):
        company = yfinance.Ticker(ticker)
        company_info = company.info

        return {
            "company_name": company_info["shortName"],
            "price": round(company_info["regularMarketPrice"], 3),
            "price_currency": company_info["currency"],
            "ticker": ticker,
            "transaction_date": datetime.now().strftime("%Y-%m-%d"),
        }

    def get_historical_data(self, ticker: str, start_date: str, end_date: str):
        company = yfinance.Ticker(ticker)
        company_info = self.get_current_data(ticker)
        result = company.history(start=start_date, end=end_date, period="1d")
        # print(type(result))
        # print(result)
        prices = []
        for col, row in result.iterrows():
            # result += max(row.B, row.C)
            # print(element)
            print(col)
            print(row["Close"])
            data = {
                "company_name": company_info["company_name"],
                "price": round(row["Close"], 3),
                "price_currency": company_info["price_currency"],
                "ticker": ticker,
                "transaction_date": col.to_pydatetime().strftime("%Y-%m-%d"),
            }
            prices.append(data)
        print(f"Found {len(prices)} historical prices")
        return prices
