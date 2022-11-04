import json
import logging
from os import path
import pathlib
from django.db.utils import IntegrityError
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.http import is_safe_url
from django.http import HttpResponseRedirect
from ..models import Currency


logger = logging.getLogger("buho_backend")


@staff_member_required
def create_currencies(request):
    logger.debug("Creating currencies...")
    next_url = request.GET.get("next")
    if next_url and is_safe_url(url=next_url, allowed_hosts=request.get_host()):
        currencies_list, handled = create_initial_currencies()

        messages.info(
            request,
            f"{handled} currencies created: {', '.join(currencies_list)}",
        )

        return HttpResponseRedirect(next_url)


def create_initial_currencies():
    currencies_list = []
    with open(
        path.join(
            pathlib.Path(__file__).parent.parent.resolve(),
            "data",
            "currencies.json",
        ),
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        handled = 0
        for currency in data:
            try:
                result = Currency.objects.create(
                    name=currency["name"],
                    symbol=currency["symbol"],
                    code=currency["code"],
                )
                if result:
                    handled += 1
                    currencies_list.append(currency["code"])
            except IntegrityError as error:
                logger.warning(f"{currency['code']} already exists ({error})")
    return currencies_list, handled
