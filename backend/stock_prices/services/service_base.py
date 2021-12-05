class StockPriceServiceBase:
    @classmethod
    def get_current_data(self, ticker: str) -> dict:
        raise NotImplementedError

    @classmethod
    def get_historical_data(self, ticker: str, from_date: str, to_date: str) -> dict:
        raise NotImplementedError
