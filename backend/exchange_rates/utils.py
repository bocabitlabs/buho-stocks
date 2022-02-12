import datetime
from companies.models import Company
from exchange_rates.models import ExchangeRate
from exchange_rates.serializers import ExchangeRateSerializer
from forex_python.converter import CurrencyRates, RatesNotAvailableError
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

class ExchangeRatesUtils:

    def __init__(self, company: Company, use_currency: str = "portfolio"):
        self.company = company
        self.use_currency = use_currency

    def get_exchange_rate_for_date(self, transaction_date: str):
        exchange_rate_value = 1
        if self.use_currency == "portfolio":
            if self.company.base_currency != self.company.portfolio.base_currency:
                try:
                    exchange_rate = ExchangeRate.objects.get(
                        exchange_from=self.company.base_currency,
                        exchange_to=self.company.portfolio.base_currency,
                        exchange_date=transaction_date,
                    )
                    exchange_rate_value = exchange_rate.exchange_rate
                except ExchangeRate.DoesNotExist:
                    try:
                        exchange_rate = get_exchange_rates_from_api(
                            self.company.base_currency,
                            self.company.portfolio.base_currency,
                            transaction_date,
                        )
                        exchange_rate_value = exchange_rate["exchange_rate"].value
                    except RatesNotAvailableError as error:
                        logger.debug(str(error))
        return exchange_rate_value