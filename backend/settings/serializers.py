from settings.models import UserSettings
from rest_framework import serializers


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['company_display_mode', 'company_sort_by', 'language', 'last_updated',
                  'main_portfolio', 'portfolio_sort_by', 'portfolio_display_mode', 'id', 'timezone']
