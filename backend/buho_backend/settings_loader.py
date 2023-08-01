import os

from django.core.exceptions import ImproperlyConfigured


def get_settings_module():
    env = os.environ.get("DJANGO_ENV")
    default_env = "buho_backend.settings.dev"

    if not env:
        print("Please set the DJANGO_ENV environment variable. Use 'dev', 'test', or 'prod'. Falling back to 'dev'.")
        return default_env

    if env == "dev":
        return default_env
    elif env == "test":
        return "buho_backend.settings.test"
    elif env == "prod":
        return "buho_backend.settings.prod"
    else:
        raise ImproperlyConfigured("Invalid value for DJANGO_ENV. Use 'dev', 'test', or 'prod'.")
