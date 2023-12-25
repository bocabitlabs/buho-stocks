import os

from decouple import config  # type: ignore [import]

from .common import *  # noqa: F401, F403

LOG_LEVEL = config("LOG_LEVEL", default="INFO")
LOGS_ROOT = config("LOGS_ROOT")
LOGGER_HANDLERS = config("LOGGER_HANDLERS", cast=lambda v: [s.strip() for s in v.split(",")])

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
        "debug_file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "debug.log"),
        },
        "info_file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "info.log"),
        },
        "error_file": {
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
