from log_messages.models import LogMessage
from portfolios.models import Portfolio
from rest_framework import serializers


class LogMessageSerializer(serializers.ModelSerializer):
    portfolio = serializers.PrimaryKeyRelatedField(queryset=Portfolio.objects, many=False, read_only=False)

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
