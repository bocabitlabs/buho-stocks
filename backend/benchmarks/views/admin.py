import json
import logging
from os import path
import pathlib
from typing import Tuple
from django.db.utils import IntegrityError
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.http import is_safe_url
from django.http import HttpResponseRedirect
from djmoney.money import Money
from benchmarks.models import Benchmark, BenchmarkYear


logger = logging.getLogger("buho_backend")


def create_initial_benchmarks() -> Tuple[list[dict], int]:
    # Add super sectors
    benchmarks_list = []
    handled_benchmarks = 0

    with open(
        path.join(
            pathlib.Path(__file__).parent.parent.resolve(),
            "data",
            "benchmarks.json",
        ),
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        for benchmark in data:
            existing = Benchmark.objects.filter(name=benchmark["name"]).exists()
            if existing:
                logger.debug(f"Benchmark {benchmark['name']} already exists")
                continue
            logger.debug(f"Creating super benchmark {benchmark['name']}")
            result = Benchmark.objects.create(name=benchmark["name"])
            if result:
                handled_benchmarks += 1
                benchmarks_list.append(benchmark)

    return benchmarks_list, handled_benchmarks


def create_initial_benchmark_years() -> Tuple[list[dict], int]:
    handled_years = 0
    with open(
        path.join(
            pathlib.Path(__file__).parent.parent.resolve(),
            "data",
            "benchmark-years.json",
        ),
        "r",
        encoding="utf-8",
    ) as file:
        data = file.read()
        data = json.loads(data)
        benchmarks = Benchmark.objects.all()
        for benchmark in benchmarks:
            for benchmark_year in data:
                if benchmark_year["benchmark"] == benchmark.name:
                    logger.debug(
                        f"Creating benchmark year {benchmark_year['benchmark']} for benchmark {benchmark.name}"
                    )
                    try:
                        result = BenchmarkYear.objects.create(
                            year=benchmark_year["year"],
                            return_percentage=benchmark_year["return_percentage"],
                            benchmark=benchmark,
                            value=Money(
                                benchmark_year["value"],
                                benchmark_year["value_currency"],
                            ),
                        )
                    except IntegrityError as error:
                        logger.warning(
                            f"Benchmark year {benchmark_year['benchmark']} already exists ({error})"
                        )
                        continue

                    if result:
                        handled_years += 1
    return handled_years


def display_messages(
    request,
    handled_benchmarks: int,
    handled_benchmark_years: int,
    created_benchmarks: str,
):
    if handled_benchmarks > 0:
        messages.info(
            request,
            f"{handled_benchmarks} benchmarks created. {created_benchmarks}",
        )
    else:
        messages.info(
            request,
            "No benchmarks created.",
        )
    if handled_benchmark_years > 0:
        messages.info(
            request,
            f"{handled_benchmark_years} benchmark years created.",
        )
    else:
        messages.info(
            request,
            "No benchmarks years created.",
        )


@staff_member_required
def create_benchmarks(request):
    logger.debug("Creating benchmarks...")
    next_url = request.GET.get("next")
    if next_url and is_safe_url(url=next_url, allowed_hosts=request.get_host()):
        benchmarks_list, handled_benchmarks = create_initial_benchmarks()
        handled_benchmark_years = create_initial_benchmark_years()

        created_benchmarks = ", ".join(
            benchmark["name"] for benchmark in benchmarks_list
        )
        display_messages(
            request,
            handled_benchmarks=handled_benchmarks,
            handled_benchmark_years=handled_benchmark_years,
            created_benchmarks=created_benchmarks,
        )

        return HttpResponseRedirect(next_url)
