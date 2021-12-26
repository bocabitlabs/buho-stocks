from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from markets.serializers import MarketSerializer
from markets.models import Market


class MarketListAPIView(APIView):
    """Get all the markets from a user"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["markets"])
    def get(self, request, *args, **kwargs):
        """
        List all the market items for given requested user
        """
        todos = Market.objects.filter(user=request.user.id)
        serializer = MarketSerializer(todos, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(tags=["markets"], request_body=MarketSerializer)
    def post(self, request, *args, **kwargs):
        """
        Create the Market with given market data
        """
        data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "color": request.data.get("color"),
            "region": request.data.get("region"),
            "open_time": request.data.get("open_time"),
            "close_time": request.data.get("close_time"),
        }
        serializer = MarketSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarketDetailAPIView(APIView):
    """Operations for a single Market"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, market_id, user_id):
        """
        Get a market object from a user given the market id
        """
        try:
            return Market.objects.get(id=market_id, user=user_id)
        except Market.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["markets"])
    def get(self, request, market_id, *args, **kwargs):
        """
        Retrieve the market item with given market_id
        """
        todo_instance = self.get_object(market_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MarketSerializer(todo_instance, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["markets"], request_body=MarketSerializer)
    def put(self, request, market_id, *args, **kwargs):
        """
        Update the market item with given market_id
        """
        todo_instance = self.get_object(market_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "color": request.data.get("color"),
            "region": request.data.get("region"),
            "open_time": request.data.get("open_time"),
            "close_time": request.data.get("close_time"),
        }
        serializer = MarketSerializer(
            instance=todo_instance,
            data=data,
            partial=True,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["markets"])
    def delete(self, request, market_id, *args, **kwargs):
        """
        Delete the market item with given market_id
        """
        market_instance = self.get_object(market_id, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
