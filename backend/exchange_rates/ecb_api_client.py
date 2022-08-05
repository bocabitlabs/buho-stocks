import logging
import requests
import pandas as pd
import io
from backend.exchange_rates.models import ExchangeRate

from backend.exchange_rates.serializers import ExchangeRateSerializer

logger = logging.getLogger("buho_backend")

class EcbApiClientError(Exception):
  pass


class EcbApiClient:

  def __init__(self) -> None:
      self.endpoint = 'https://sdw-wsrest.ecb.europa.eu/service/'
      self.resource = 'data'
      self.flow_ref ='EXR'

  @property
  def session():
    session = requests.Session()

    return session

  def get_exchange_rate_from_api(self, from_currency, to_currency, exchange_date):

    key =  f"D.{from_currency}.{to_currency}.SP00.A"
    request_url = self.endpoint + self.resource + '/'+ self.flow_ref + '/' + key

    logger.debug("Call the exchange API")
    logger.debug(f"From: {from_currency} To: {to_currency} Date: {exchange_date}")

    parameters = {
     'startPeriod': exchange_date,
     'endPeriod': exchange_date,
     'format': 'csvdata'
    }
    print(parameters)
    response = requests.get(request_url, params=parameters, timeout=4)
    parsed_response = self.parse_csv_data(response.text)

    if parsed_response:
      result = self.save_exchange_rate(from_currency, to_currency, exchange_date, parsed_response)
      return result
    return None

  def parse_csv_data(self, csv_data: str):
    df = pd.read_csv(io.StringIO(csv_data))
    ts = df.filter(['TIME_PERIOD', 'OBS_VALUE'], axis=1)
    ts = ts.set_index('TIME_PERIOD')
    result = ts.to_json()

    return result

  def save_exchange_rate(self, from_currency, to_currency, exchange_date, exchange_rate_data):
    value = exchange_rate_data["OBS_VALUE"][exchange_date]
    data = {
        "exchange_from": from_currency,
        "exchange_to": to_currency,
        "exchange_date": exchange_date,
        "exchange_rate": round(value, 3),
    }
    serializer = ExchangeRateSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return serializer

    logger.debug("Serializer is not valid")
    logger.debug(serializer.errors)
    return None


  def get_exchange_rate_for_date(self, from_currency: str, to_currency: str, transaction_date: str):

        if from_currency == to_currency:
          exchange_rate_value = 1
          return exchange_rate_value

        try:
            exchange_rate = ExchangeRate.objects.get(
                exchange_from=from_currency,
                exchange_to=to_currency,
                exchange_date=transaction_date,
            )
            exchange_rate_value = exchange_rate.exchange_rate
            return exchange_rate_value
        except ExchangeRate.DoesNotExist:
            exchange_rate = self.get_exchange_rate_from_api(
                from_currency,
                to_currency,
                transaction_date,
            )
            if exchange_rate:
                exchange_rate_value = exchange_rate["exchange_rate"].value
                return exchange_rate_value
        except EcbApiClientError as error:
            logger.debug(str(error),exc_info=True)
            return None