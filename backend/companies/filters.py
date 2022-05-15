from rest_framework import serializers

class FilteredCompanySerializer(serializers.ListSerializer):
    def to_representation(self, data):
        data = data.filter(is_closed=False)
        return super(FilteredCompanySerializer,  self).to_representation(data)