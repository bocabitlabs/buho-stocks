import json
import logging
from os import path
import pathlib

from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.http import is_safe_url
from django.http import HttpResponseRedirect

from markets.models import Market

logger = logging.getLogger("buho_backend")


@staff_member_required
def create_markets(request):
    logger.debug("Creating markets...")
    next_url = request.GET.get("next")
    if next_url and is_safe_url(url=next_url, allowed_hosts=request.get_host()):
        markets_list = []
        logger.debug("Creating indexes")
        with open(
            path.join(
                pathlib.Path(__file__).parent.parent.resolve(),
                "data",
                "markets.json",
            ),
            "r",
            encoding="utf-8",
        ) as file:
            data = file.read()
            data = json.loads(data)
            handled_markets = 0
            for market in data:
                result = Market.objects.create(
                    name=market["name"],
                    description=market["description"],
                    region=market["region"],
                    open_time=market["open_time"],
                    close_time=market["close_time"],
                    timezone=market["timezone"],
                )
                if result:
                    handled_markets += 1
                    markets_list.append(market["name"])

            messages.info(
                request,
                f"{handled_markets} markets created: {', '.join(markets_list)}",
            )

        return HttpResponseRedirect(next_url)
