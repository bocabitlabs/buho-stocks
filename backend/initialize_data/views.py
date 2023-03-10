# Create your views here.
import logging

from benchmarks.serializers import BenchmarkSerializer
from drf_yasg.utils import swagger_auto_schema
from initialize_data.initializers.benchmarks import create_initial_benchmarks
from initialize_data.initializers.markets import create_initial_markets
from initialize_data.initializers.sectors import initialize_all_sectors
from markets.serializers import MarketSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from sectors.serializers import SectorSerializer

logger = logging.getLogger("buho_backend")


class InitializeMarketsView(APIView):
    """
    A viewset for viewing and editing market instances.
    """

    @swagger_auto_schema(tags=["initializers"], responses={201: MarketSerializer(many=True)})
    def post(self, request, format=None):
        """
        Initialize all the markets
        """
        markets_list = create_initial_markets()
        serializer = MarketSerializer(markets_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InitializeBenchmarksView(APIView):
    """
    A viewset for viewing and editing market instances.
    """

    @swagger_auto_schema(tags=["initializers"], responses={201: BenchmarkSerializer(many=True)})
    def post(self, request, format=None):
        """
        Initialize all the benchmarks
        """
        markets_list = create_initial_benchmarks()
        serializer = BenchmarkSerializer(markets_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InitializeSectorsView(APIView):
    """
    A viewset for viewing and editing market instances.
    """

    @swagger_auto_schema(tags=["initializers"], responses={201: SectorSerializer(many=True)})
    def post(self, request, format=None):
        """
        Initialize all the sectors
        """
        markets_list = initialize_all_sectors()
        serializer = SectorSerializer(markets_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
