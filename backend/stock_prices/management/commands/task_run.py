import logging

from django.core.management.base import BaseCommand

from stats.tasks import debug_task

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Runs a sample task"

    def handle(self, *args, **options):
        self.stdout.write("Running sample task")
        debug_task.delay()
