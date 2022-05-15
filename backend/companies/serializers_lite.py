from rest_framework import serializers
from companies.filters import FilteredCompanySerializer
from companies.models import Company


class CompanySerializerLite(serializers.ModelSerializer):

    class Meta:
        model = Company
        list_serializer_class = FilteredCompanySerializer
        fields = [
            "id",
            "name",
            "ticker",
        ]
