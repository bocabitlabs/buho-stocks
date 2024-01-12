import json
import logging
import pathlib
from os import path

from django.db import IntegrityError
from moneyed import Money

from benchmarks.models import Benchmark, BenchmarkYear

logger = logging.getLogger("buho_backend")


def create_initial_benchmarks() -> list[Benchmark]:
    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "benchmarks.json",
    )
    added_benchmarks = create_initial_benchmarks_from_json(json_path)

    return added_benchmarks


def create_initial_benchmarks_from_json(json_path: str) -> list[Benchmark]:
    benchmarks_list = []

    with open(
        json_path,
        "r",
        encoding="utf-8",
    ) as file:
        data_file = file.read()
        data = json.loads(data_file)
        for benchmark in data:
            existing = Benchmark.objects.filter(name=benchmark["name"]).exists()
            if existing:
                logger.debug(f"Benchmark {benchmark['name']} already exists")
                continue
            logger.debug(f"Creating super benchmark {benchmark['name']}")
            result = Benchmark.objects.create(name=benchmark["name"])
            if result:
                benchmarks_list.append(benchmark)
    return benchmarks_list


def create_initial_benchmark_years() -> list[BenchmarkYear]:
    json_file = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "benchmark-years.json",
    )
    benchmark_years_list = create_initial_benchmark_years_from_json(json_file)

    return benchmark_years_list


def create_initial_benchmark_years_from_json(json_path: str) -> list[BenchmarkYear]:
    handled_years = []

    with open(json_path, "r", encoding="utf-8") as file:
        data_file = file.read()
        data = json.loads(data_file)
        benchmarks = Benchmark.objects.all()
        for benchmark in benchmarks:
            for benchmark_year in data:
                if benchmark_year["benchmark"] == benchmark.name:
                    logger.debug(
                        f"Creating benchmark year {benchmark_year['benchmark']} "
                        f"for benchmark {benchmark.name}"
                    )
                    try:
                        benchmark_value = Money(
                            benchmark_year["value"],
                            benchmark_year["value_currency"],
                        )

                        result = BenchmarkYear.objects.create(
                            year=benchmark_year["year"],
                            return_percentage=benchmark_year["return_percentage"],
                            benchmark=benchmark,
                            value=benchmark_value,
                        )
                    except IntegrityError as error:
                        logger.warning(
                            f"Benchmark year {benchmark_year['benchmark']} "
                            f"already exists ({error})"
                        )
                        continue

                    if result:
                        handled_years.append(result)
    return handled_years
