from markets.models import Market
from rest_framework import serializers


class MarketSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Market
        fields = ['name', 'description', 'color', 'region', 'open_time',
                  'close_time', 'date_created', 'last_updated']
