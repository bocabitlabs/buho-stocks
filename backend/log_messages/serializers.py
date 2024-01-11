from rest_framework import serializers
from rest_framework.fields import Field

from log_messages.models import LogMessage
from portfolios.models import Portfolio


class LogMessageSerializer(serializers.ModelSerializer):
    portfolio: Field = serializers.PrimaryKeyRelatedField(queryset=Portfolio.objects, many=False, read_only=False)

    class Meta:
        model = LogMessage
        fields = [
            "id",
            "message_type",
            "message_text",
            "portfolio",
            "date_created",
            "last_updated",
        ]
