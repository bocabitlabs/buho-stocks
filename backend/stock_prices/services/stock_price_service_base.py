from typing import TypedDict


class TypedStockPrice(TypedDict):
    price: float
    price_currency: str
    ticker: str
    transaction_date: str


class StockPriceServiceBase:
    def get_stock_prices_list(self, ticker: str, start_date: str, end_date: str) -> list[TypedStockPrice]:
        raise NotImplementedError
