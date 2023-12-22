import logging

from django.core.management.base import BaseCommand

from initialize_data.initializers.benchmarks import create_initial_benchmark_years, create_initial_benchmarks

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Add the initial benchmarks on the database"

    def handle(self, *args, **options):
        self.stdout.write("Adding initial benchmarks to the database")

        benchmarks = create_initial_benchmarks()
        benchmarks_years = create_initial_benchmark_years()

        self.stdout.write(self.style.SUCCESS(f"Created {len(benchmarks)}{[market.name for market in benchmarks]}"))
        self.stdout.write(self.style.SUCCESS(f"Added {len(benchmarks_years)} years of data to the benchmarks"))
