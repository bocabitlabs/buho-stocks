import json
import logging
import pathlib
from os import path
from typing import Dict, List

from sectors.models import Sector, SuperSector

logger = logging.getLogger("buho_backend")


super_sectors_json_path = path.join(
    pathlib.Path(__file__).parent.parent.resolve(),
    "data",
    "super_sectors.json",
)

sectors_json_path = path.join(
    pathlib.Path(__file__).parent.parent.resolve(),
    "data",
    "sectors.json",
)


def initialize_all_sectors():
    create_initial_super_sectors()
    create_initial_sectors()
    match_super_sectors()


def create_initial_super_sectors() -> list[SuperSector]:
    super_sector_list = create_initial_super_sectors_from_json(super_sectors_json_path)
    return super_sector_list


def create_initial_sectors() -> list[Sector]:
    sector_list = create_initial_sectors_from_json(sectors_json_path)
    return sector_list


def create_initial_super_sectors_from_json(json_path: str) -> list[SuperSector]:
    # Add super sectors
    super_sector_list = []

    sectors_data = load_sector_dicts(json_path)

    for super_sector in sectors_data:
        existing = SuperSector.objects.filter(name=super_sector["name"]).exists()
        if existing:
            logger.debug(f"Super sector {super_sector['name']} already exists")
            continue
        logger.debug(f"Creating super super sector {super_sector['name']}")
        result = SuperSector.objects.create(name=super_sector["name"])
        if result:
            super_sector_list.append(result)

    return super_sector_list


def load_sector_dicts(json_path: str) -> List[Dict]:
    with open(
        json_path,
        "r",
        encoding="utf-8",
    ) as file:
        file_data = file.read()
        data: List[Dict] = json.loads(file_data)

        return data


def create_initial_sectors_from_json(json_path: str) -> list[Sector]:
    sectors_list = []

    sectors_data = load_sector_dicts(json_path)

    for sector in sectors_data:
        existing = Sector.objects.filter(name=sector["name"]).exists()
        if existing:
            logger.debug(f"Sector {sector['name']} already exists")
            continue
        logger.debug(f"Creating sector {sector['name']}")
        result = Sector.objects.create(name=sector["name"])

        if result:
            sectors_list.append(result)
    return sectors_list


def match_super_sectors() -> int:
    super_sectors_set = 0

    super_sector_list = load_sector_dicts(super_sectors_json_path)
    sectors_list = load_sector_dicts(sectors_json_path)

    for super_sector in super_sector_list:
        super_sector_id = super_sector["id"]
        for sector in sectors_list:
            if sector["super_sector_id"] == super_sector_id:
                sector_object = Sector.objects.get(name=sector["name"])
                sector_object.super_sector = SuperSector.objects.get(
                    name=super_sector["name"]
                )
                sector_object.save()
                logger.debug(f"Setting super sector {super_sector} for sector {sector}")
                super_sectors_set += 1
    return super_sectors_set
