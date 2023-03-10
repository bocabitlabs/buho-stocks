import json
import logging
import pathlib
from os import path

from currencies.models import Currency

logger = logging.getLogger("buho_backend")


def create_initial_currencies():
    currencies_list = []
    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "currencies.json",
    )
    currencies_list = create_initial_currencies_from_json(json_path)

    return currencies_list


def create_initial_currencies_from_json(json_path: str) -> list[Currency]:
    currencies_list: list[Currency] = []
    with open(
        json_path,
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        for currency in data:
            existing = Currency.objects.filter(name=currency["code"]).exists()
            if existing:
                logger.debug(f"Currency {currency['code']} already exists")
                continue
            result = Currency.objects.create(
                name=currency["name"],
                symbol=currency["symbol"],
                code=currency["code"],
            )
            if result:
                currencies_list.append(currency["code"])
    return currencies_list
