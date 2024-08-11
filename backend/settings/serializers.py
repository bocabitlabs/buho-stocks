from rest_framework import serializers

from settings.models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            "company_display_mode",
            "company_sort_by",
            "display_welcome",
            "language",
            "id",
            "last_updated",
            "main_portfolio",
            "portfolio_sort_by",
            "portfolio_display_mode",
            "timezone",
            "sentry_dsn",
            "sentry_enabled",
        ]
