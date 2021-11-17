from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from portfolios.serializers import PortfolioSerializer, PortfolioSerializerGet
from portfolios.models import Portfolio


class PortfoliosListAPIView(APIView):
    """Get all the markets from a user"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["portfolios"])
    def get(self, request, *args, **kwargs):
        """
        List all the portfolio items for given requested user
        """
        elements = Portfolio.objects.filter(user=request.user.id)
        serializer = PortfolioSerializerGet(elements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(tags=["portfolios"], request_body=PortfolioSerializer)
    def post(self, request, *args, **kwargs):
        """
        Create the portfolio with given portfolio data
        """
        data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "color": request.data.get("color"),
            "hide_closed_companies": request.data.get("hide_closed_companies"),
            "base_currency": request.data.get("base_currency"),
        }
        serializer = PortfolioSerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioDetailAPIView(APIView):
    """Operations for a single Portfolio"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, user_id):
        """
        Get a market object from a user given the portfolio id
        """
        try:
            return Portfolio.objects.get(id=portfolio_id, user=user_id)
        except Portfolio.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolios"])
    def get(self, request, portfolio_id, *args, **kwargs):
        """
        Retrieve the portfolio item with given portfolio_id
        """
        instance = self.get_object(portfolio_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PortfolioSerializerGet(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["portfolios"], request_body=PortfolioSerializer)
    def put(self, request, portfolio_id, *args, **kwargs):
        """
        Update the portfolio item with given portfolio_id
        """
        instance = self.get_object(portfolio_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "color": request.data.get("color"),
            "hide_closed_companies": request.data.get("hide_closed_companies"),
            "base_currency": request.data.get("base_currency"),
        }
        serializer = PortfolioSerializer(instance=instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["portfolios"])
    def delete(self, request, portfolio_id, *args, **kwargs):
        """
        Delete the portfolio item with given portfolio_id
        """
        market_instance = self.get_object(portfolio_id, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)