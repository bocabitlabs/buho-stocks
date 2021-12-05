from rest_framework import serializers
from buho_backend.serializers import UserFilteredPrimaryKeyRelatedField
from buho_backend.validators import validate_ownership
from log_messages.models import LogMessage
from portfolios.models import Portfolio


class LogMessageSerializer(serializers.ModelSerializer):
    portfolio = UserFilteredPrimaryKeyRelatedField(
        queryset=Portfolio.objects, many=False, read_only=False
    )

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

    def validate(self, attrs):
        portfolio = attrs["portfolio"]

        validate_ownership(self.context, portfolio, Portfolio)
        return attrs
