"""
WSGI config for buho_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from buho_backend.settings_loader import get_settings_module
from django.core.wsgi import get_wsgi_application

settings_module = get_settings_module()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)


application = get_wsgi_application()
