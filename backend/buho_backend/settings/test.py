import os

from .common import *

# Override or add settings specific to the testing environment
DEBUG = False
ALLOWED_HOSTS = []
DB_TYPE = "sqlite"
SQLITE_DB_PATH = path.join(BASE_DIR.parent.parent, "data", "db_test.sqlite3")
LOGS_ROOT = path.join(BASE_DIR.parent.parent, "data")
LOG_LEVEL = "INFO"
LOGGER_HANDLERS = ["console"]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": SQLITE_DB_PATH,
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "file": {
            "format": "{levelname} | {asctime} | {module}:{lineno} | {process:d} | {thread:d} | {message}",
            "style": "{",
        },
        "console": {
            "format": "{levelname} | {asctime} | {message} | {pathname}:{lineno} | {module} | {funcName}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "console"},
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "debug.log"),
        },
        "file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "info.log"),
        },
        "file": {
            "level": "ERROR",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "error.log"),
        },
    },
    "loggers": {
        "*": {
            "handlers": LOGGER_HANDLERS,
            "level": "ERROR",
            "propagate": True,
        },
        "buho_backend": {
            "handlers": LOGGER_HANDLERS,
            "level": LOG_LEVEL,
            "propagate": True,
        },
    },
}
