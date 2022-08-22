import logging
from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema


from benchmarks.models import Benchmark, BenchmarkYear

from benchmarks.serializers import (
    BenchmarkSerializer,
    BenchmarkYearSerializer,
)

logger = logging.getLogger("buho_backend")


class BenchmarkAPIView(APIView):

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["benchmarks"])
    def get(self, request, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        instance = Benchmark.objects.all()
        serializer = BenchmarkSerializer(instance, many=True)

        if not serializer:
            return Response(
                {"res": "No benchmarks found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_200_OK)


class BenchmarkYearsAPIView(APIView):

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["benchmarks"])
    def get(self, request, benchmark_id, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        instance = BenchmarkYear.objects.filter(benchmark=benchmark_id).order_by("year")
        serializer = BenchmarkYearSerializer(instance, many=True)

        if not serializer:
            return Response(
                {"res": "No benchmark years found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
