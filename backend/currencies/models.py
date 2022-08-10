from operator import itemgetter
from currencies.data.currencies import currencies_list


def get_currency_details(currency_code):
    currencies = [c for c in currencies_list if c["code"] == currency_code]
    if len(currencies) == 1:
        currency = currencies[0]
        return currency
    return None


def get_all_currencies():
    currencies = currencies_list
    sorted_list = sorted(currencies, key=itemgetter("code"))
    return sorted_list
