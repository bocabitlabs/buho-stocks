from settings.models import UserSettings
from rest_framework import serializers


class UserSettingsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['language']