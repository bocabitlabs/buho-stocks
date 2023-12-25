from typing import TypedDict


class TypedStockPrice(TypedDict):
    price: float
    price_currency: str
    ticker: str
    transaction_date: str
