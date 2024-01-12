"""
Django settings for buho_backend project.

Generated by 'django-admin startproject' using Django 3.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
import logging
import os
from os import path
from pathlib import Path

import sentry_sdk

# from decouple import Config, RepositoryEnv
from decouple import config
from sentry_sdk.integrations.django import DjangoIntegration

logger = logging.getLogger("buho_backend")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)
TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS", cast=lambda v: [s.strip() for s in v.split(",")]
)

# Application definition

INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_filters",
    "djmoney",
    "rest_framework",
    "rest_framework.authtoken",
    "drf_yasg",
    "corsheaders",
    "django_celery_results",
    "companies",
    "currencies",
    "dividends_transactions",
    "exchange_rates",
    "log_messages",
    "markets",
    "portfolios",
    "rights_transactions",
    "sectors",
    "settings",
    "shares_transactions",
    "stats",
    "stock_prices",
    "benchmarks",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "buho_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # 'rest_framework.authentication.TokenAuthentication',
    ],
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
        # Any other renders
    ),
    "DEFAULT_PARSER_CLASSES": (
        # If you use MultiPartFormParser or FormParser,
        # we also have a camel case version
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
        # Any other parsers
    ),
    "JSON_UNDERSCOREIZE": {
        "no_underscore_before_number": True,
    },
}

SERIALIZATION_MODULES = {"json": "djmoney.serializers"}

WSGI_APPLICATION = "buho_backend.wsgi.application"

DB_TYPE = config("DB_TYPE")
SQLITE_DB_PATH = config("DATABASE_SQLITE_PATH", default="/usr/src/data/db.sqlite3")

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": SQLITE_DB_PATH,
    }
}
if DB_TYPE == "mysql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": config("DB_NAME", default="buho_stocks"),
            "USER": config("DB_USER", default="root"),
            "PASSWORD": config("DB_PASSWORD", default="example"),
            "HOST": config("DB_HOSTNAME", default="db"),
            "PORT": config("DB_PORT", default=3306, cast=int),
        }
    }
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",  # noqa
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = config("TIME_ZONE")

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = "/static-files/"
STATIC_ROOT = "/app/static/"

MEDIA_URL = "/media/"
MEDIA_ROOT = config("MEDIA_ROOT")

SWAGGER_SETTINGS: dict = {}

LOGS_ROOT = config("LOGS_ROOT")

if config("ENABLE_SENTRY", default=False, cast=bool):
    sentry_sdk.init(
        dsn=config("SENTRY_DSN", default="", cast=str),
        integrations=[
            DjangoIntegration(),
        ],
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,
        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True,
    )

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")]
)

# Redis Configuration Options
REDIS_HOSTNAME = config("REDIS_HOSTNAME", default="redis")
REDIS_PORT = config("REDIS_PORT", default=6379, cast=int)
REDIS_DB = config("REDIS_DB", default="0", cast=int)

# Celery Configuration Options
CELERY_BROKER_URL = f"redis://{REDIS_HOSTNAME}:{REDIS_PORT}/{REDIS_DB}"
DJANGO_CELERY_RESULTS_TASK_ID_MAX_LENGTH = 191
CELERY_TIMEZONE = "Europe/Zurich"
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_RESULT_BACKEND = "django-db"
CELERY_CACHE_BACKEND = "django-cache"

ASGI_APPLICATION = "buho_backend.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOSTNAME, REDIS_PORT)],
        },
    },
}

# This is the default year used to store the stats for the "All" year
YEAR_FOR_ALL = 9999


LOG_LEVEL = config("LOG_LEVEL", default="INFO")
LOGS_ROOT = config("LOGS_ROOT")
LOGGER_HANDLERS = config(
    "LOGGER_HANDLERS", cast=lambda v: [s.strip() for s in v.split(",")]
)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "file": {
            "format": "{levelname} | {asctime} | {pathname}:{lineno} | {message} | {module} | {funcName}",  # noqa
            "style": "{",
        },
        "console": {
            "format": "{levelname} | {asctime} | {pathname}:{lineno} | {message} | {module} | {funcName}",  # noqa
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
