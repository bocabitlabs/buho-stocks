from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from currencies.models import get_currency_details
from portfolios.serializers import PortfolioSerializer, PortfolioSerializerGet
from portfolios.models import Portfolio


class PortfoliosListAPIView(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["portfolios"])
    def get(self, request, *args, **kwargs):
        """
        List all the portfolio items for given requested user
        """
        elements = Portfolio.objects.filter(user=request.user.id)
        for element in elements:
            base_currency = get_currency_details(element.base_currency)
            element.base_currency = base_currency
        serializer = PortfolioSerializerGet(
            elements, many=True, context={"request": request}
        )
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
            "country_code": request.data.get("country_code"),
        }
        serializer = PortfolioSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioDetailAPIView(APIView):
    """Operations for a single Portfolio"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, user_id):
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

        base_currency = get_currency_details(instance.base_currency)
        instance.base_currency = base_currency

        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = PortfolioSerializerGet(instance, context={"request": request})
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
            "country_code": request.data.get("country_code"),
        }
        serializer = PortfolioSerializer(
            instance=instance, data=data, partial=True, context={"request": request}
        )
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
        instance = self.get_object(portfolio_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
