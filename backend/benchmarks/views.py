import logging

from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from benchmarks.models import Benchmark, BenchmarkYear
from benchmarks.serializers import BenchmarkSerializer, BenchmarkSerializerDetails, BenchmarkYearSerializer

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        operation_description="Get a list of benchmarks",
        tags=["Benchmarks"],
        responses={200: BenchmarkSerializer(many=True)},
    ),
)
@method_decorator(
    name="retrieve",
    decorator=swagger_auto_schema(
        operation_description="Get an existing benchmark",
        tags=["Benchmarks"],
        responses={200: BenchmarkSerializer(many=False)},
    ),
)
@method_decorator(
    name="create",
    decorator=swagger_auto_schema(
        operation_description="Create a new benchmark",
        tags=["Benchmarks"],
        responses={200: BenchmarkSerializer(many=False)},
    ),
)
@method_decorator(
    name="update",
    decorator=swagger_auto_schema(
        operation_description="Update an existing benchmark",
        tags=["Benchmarks"],
        responses={200: BenchmarkSerializer(many=False)},
    ),
)
@method_decorator(
    name="partial_update",
    decorator=swagger_auto_schema(
        operation_description="Patch an existing benchmark",
        tags=["Benchmarks"],
        responses={200: BenchmarkSerializer(many=False)},
    ),
)
@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(
        operation_description="Delete an existing benachmark",
        tags=["Benchmarks"],
    ),
)
class BenchmarkViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing benchmark instances.
    """

    serializer_class = BenchmarkSerializer
    queryset = Benchmark.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BenchmarkSerializerDetails
        return super().get_serializer_class()

    @method_decorator(
        name="action",
        decorator=swagger_auto_schema(
            operation_description="List all years from a benchmark",
            tags=["Benchmarks"],
            responses={200: BenchmarkYearSerializer(many=True)},
        ),
    )
    @action(detail=True, name="Benchmarks", methods=["get"])
    def years(self, request, pk=None):
        instance = BenchmarkYear.objects.filter(benchmark=pk).order_by("year")
        serializer = BenchmarkYearSerializer(instance, many=True)
        return Response(serializer.data)


class BenchmarkYearViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    A viewset for viewing and editing benchmark year instances.
    """

    serializer_class = BenchmarkYearSerializer
    queryset = BenchmarkYear.objects.all()
