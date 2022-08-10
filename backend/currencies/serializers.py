from rest_framework import serializers


class CurrencySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    code = serializers.CharField(max_length=200)
    symbol = serializers.CharField(max_length=200)
