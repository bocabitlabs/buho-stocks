import json
import logging
from os import path
import pathlib
from typing import Tuple
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.http import is_safe_url
from django.contrib import messages
from django.http import HttpResponseRedirect
from sectors.models import Sector, SuperSector

logger = logging.getLogger("buho_backend")


def create_initial_super_sectors() -> Tuple[list[dict], int]:
    # Add super sectors
    super_sector_list = []
    handled_super_sectors = 0

    with open(
        path.join(
            pathlib.Path(__file__).parent.parent.resolve(),
            "data",
            "super_sectors.json",
        ),
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        for super_sector in data:
            existing = SuperSector.objects.filter(name=super_sector["name"]).exists()
            if existing:
                logger.debug(f"Super sector {super_sector['name']} already exists")
                continue
            logger.debug(f"Creating super super sector {super_sector['name']}")
            result = SuperSector.objects.create(name=super_sector["name"])
            if result:
                handled_super_sectors += 1
                super_sector_list.append(super_sector)

    return super_sector_list, handled_super_sectors


def create_initial_sectors() -> Tuple[list[dict], int]:
    handled_sectors = 0
    sectors_list = []
    with open(
        path.join(
            pathlib.Path(__file__).parent.parent.resolve(),
            "data",
            "sectors.json",
        ),
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        for sector in data:
            existing = Sector.objects.filter(name=sector["name"]).exists()
            if existing:
                logger.debug(f"Sector {sector['name']} already exists")
                continue
            logger.debug(f"Creating sector {sector['name']}")
            result = Sector.objects.create(name=sector["name"])

            if result:
                handled_sectors += 1
                sectors_list.append(sector)
    return sectors_list, handled_sectors


def set_super_sector_for_sectors(
    super_sector_list: list[dict], sectors_list: list[dict]
) -> int:
    super_sectors_set = 0
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


def display_messages(
    request,
    handled_super_sectors: int,
    handled_sectors: int,
    super_sectors_set: int,
    created_super_sectors: str,
    created_sectors: str,
):
    if handled_super_sectors > 0:
        messages.info(
            request,
            f"{handled_super_sectors} super sectors created. {created_super_sectors}",
        )
    else:
        messages.info(
            request,
            "No super sectors created.",
        )
    if handled_sectors > 0:
        messages.info(
            request,
            f"{handled_sectors} sectors created. {created_sectors}",
        )
    else:
        messages.info(
            request,
            "No sectors created.",
        )
    if super_sectors_set > 0:
        messages.info(
            request,
            f"{super_sectors_set} super sectors set.",
        )
    else:
        messages.info(
            request,
            "No super sectors set.",
        )


@staff_member_required
def create_sectors(request):
    logger.debug("Creating sectors...")
    next_url = request.GET.get("next")
    if next_url and is_safe_url(url=next_url, allowed_hosts=request.get_host()):
        super_sectors_list, handled_super_sectors = create_initial_super_sectors()
        sectors_list, handled_sectors = create_initial_sectors()

        super_sectors_set = set_super_sector_for_sectors(
            super_sectors_list, sectors_list
        )

        created_super_sectors = ", ".join(
            sector["name"] for sector in super_sectors_list
        )
        created_sectors = ", ".join(sector["name"] for sector in sectors_list)
        display_messages(
            request,
            handled_super_sectors=handled_super_sectors,
            handled_sectors=handled_sectors,
            super_sectors_set=super_sectors_set,
            created_super_sectors=created_super_sectors,
            created_sectors=created_sectors,
        )

        return HttpResponseRedirect(next_url)
