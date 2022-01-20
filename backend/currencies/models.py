from moneyed.classes import get_country_name

from moneyed import list_all_currencies
from forex_python.converter import CurrencyCodes


def get_currency_details(currency_code, include_countries=False):
    currency_codes = CurrencyCodes()
    # if len(currency.country_codes) > 0:
    currencies = [c for c in list_all_currencies() if c.code == currency_code]
    if len(currencies) == 1:
        currency = currencies[0]
        symbol = currency_codes.get_symbol(currency_code)
        name = currency_codes.get_currency_name(currency_code)
        if symbol:
            countries = []
            if include_countries:
                for country in currency.country_codes:
                    countries.append(get_country_name(country, "en"))

            new_currency = {
                "name": name,
                "code": currency_code,
                "symbol": symbol,
                "countries": countries,
            }
            return new_currency
    return None


def get_all_currencies():
    new_currencies = []
    currency_codes = [
        "AUD",
        "BGN",
        "BRL",
        "CAD",
        "CHF",
        "CNY",
        "CZK",
        "DKK",
        "EUR",
        "GBP",
        "HKD",
        "HRK",
        "HUF",
        "IDR",
        "INR",
        "ISK",
        "JPY",
        "KRW",
        "MXN",
        "MYR",
        "NOK",
        "NZD",
        "PHP",
        "PLN",
        "RON",
        "RUB",
        "SEK",
        "SGD",
        "THB",
        "TRY",
        "USD",
        "ZAR",
    ]
    currency_codes.sort()
    for currency_code in currency_codes:
        new_currency = get_currency_details(currency_code)
        if new_currency:
            new_currencies.append(new_currency)
    return new_currencies
