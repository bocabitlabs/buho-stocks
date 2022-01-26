import datetime
from exchange_rates.serializers import ExchangeRateSerializer
from forex_python.converter import CurrencyRates
import logging

logger = logging.getLogger("buho_backend")

def get_exchange_rates_from_api(exchange_from, exchange_to, exchange_date):
    logger.debug("Call the exchange API")
    logger.debug(f"From: {exchange_from} To: {exchange_to} Date: {exchange_date}")

    if isinstance(exchange_date, str):
        exchange_date = datetime.datetime.strptime(exchange_date, "%Y-%m-%d").date()

    currency_rates = CurrencyRates()
    logger.debug(f"Making request: {exchange_from} {exchange_date}")
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
            logger.debug("Serializer is not valid")
            logger.debug(serializer.errors)
    return desired_exchange