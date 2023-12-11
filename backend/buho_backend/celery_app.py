import logging
import os

from buho_backend.settings_loader import get_settings_module
from celery import Celery
from celery.app.control import Control

settings_module = get_settings_module()

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

app = Celery("buho_celery")
control = Control(app=app)
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")
# Load task modules from all registered Django apps.
app.autodiscover_tasks()

logger = logging.getLogger("buho_backend")


def revoke_scheduled_tasks_by_name(task_name):
    # Get all active tasks
    scheduled_tasks = control.inspect().scheduled()

    for queue, tasks in scheduled_tasks.items():
        for task in tasks:
            # If the task name matches, revoke the task
            if task["name"] == task_name:
                control.revoke(task["id"], terminate=True)
