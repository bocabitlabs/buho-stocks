from django.apps import AppConfig


class SettingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'settings'

    # add this
    def ready(self):
        import settings.signals  # noqa



