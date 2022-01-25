import datetime
from exchange_rates.serializers import ExchangeRateSerializer
from forex_python.converter import CurrencyRates

def get_exchange_rates_from_api(exchange_from, exchange_to, exchange_date):
    # print("Call the exchange API")
    # print(f"From: {exchange_from} To: {exchange_to} Date: {exchange_date}")

    if isinstance(exchange_date, str):
        exchange_date = datetime.datetime.strptime(exchange_date, "%Y-%m-%d").date()

    currency_rates = CurrencyRates()
    # print(f"Making request: {exchange_from} {exchange_date}")
    rates = currency_rates.get_rates(exchange_from, exchange_date)
    desired_exchange = None
    for key in rates:
        data = {
            "exchange_from": exchange_from,
            "exchange_to": key,
            "exchange_date": exchange_date,
            "exchange_rate": round(rates[key], 3),
        }
        serializer = ExchangeRateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            if key == exchange_to:
                desired_exchange = serializer
        else:
            print("Serializer is not valid")
            print(key)
            print(serializer.errors)
    return desired_exchange