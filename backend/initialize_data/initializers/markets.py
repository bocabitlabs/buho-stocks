# Create your views here.
import json
import logging
import pathlib
from os import path

from markets.models import Market

logger = logging.getLogger("buho_backend")


def create_initial_markets() -> list[Market]:
    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "markets.json",
    )
    create_markets_list = create_initia_markets_from_json(json_path)
    return create_markets_list


def create_initia_markets_from_json(json_path: str) -> list[Market]:
    markets_list: list[Market] = []

    with open(json_path, "r", encoding="utf-8") as file:
        data = file.read()
        data = json.loads(data)
        for market in data:
            # get the market by name
            existing = Market.objects.filter(name=market["name"]).exists()
            if existing:
                logger.debug(f"Market {market['name']} already exists")
                continue
            result = Market.objects.create(
                name=market["name"],
                description=market["description"],
                region=market["region"],
                open_time=market["open_time"],
                close_time=market["close_time"],
                timezone=market["timezone"],
            )
            if result:
                markets_list.append(market)
    return markets_list
