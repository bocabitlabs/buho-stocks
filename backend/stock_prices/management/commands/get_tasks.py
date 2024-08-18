import logging

from django.core.management.base import BaseCommand
from django_celery_results.models import TaskResult

logger = logging.getLogger("buho_backend")


class Command(BaseCommand):
    help = "Gets all the tasks"

    def handle(self, *args, **options):
        self.stdout.write("Running sample task")
        results = TaskResult.objects.all()
        for result in results:
            self.stdout.write(
                f"{result.task_id} - {result.status} - {result.date_done}"
            )
