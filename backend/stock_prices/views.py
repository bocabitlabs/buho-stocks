from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from stock_prices.models import StockPrice
from stock_prices.serializers import StockPriceSerializer


class StockPricesListAPIView(APIView):
    """Get all the shares transactions from a user's company"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, *args, **kwargs):
        """
        List all the company items for given requested user
        """
        elements = StockPrice.objects.filter(user=request.user.id, company=company_id)
        serializer = StockPriceSerializer(elements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(
        tags=["company_stock_prices"], request_body=StockPriceSerializer
    )
    def post(self, request, company_id, *args, **kwargs):
        """
        Create a shares transaction with given data
        """
        data = {
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "price": request.data.get("price"),
            "company": company_id,
        }
        serializer = StockPriceSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockPricesDetailAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, transaction_date, user_id):
        try:
            return StockPrice.objects.get(
                company=company_id, transaction_date=transaction_date, user=user_id
            )
        except StockPrice.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, transaction_date, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        instance = self.get_object(company_id, transaction_date, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(
        tags=["company_stock_prices"], request_body=StockPriceSerializer
    )
    def put(self, request, company_id, transaction_date, *args, **kwargs):
        """
        Update the company item with given company_id
        """
        instance = self.get_object(company_id, transaction_date, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "price": request.data.get("price"),
            "company": company_id,
        }
        serializer = StockPriceSerializer(instance=instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["company_stock_prices"])
    def delete(self, request, company_id, transaction_date, *args, **kwargs):
        """
        Delete the company item with given transaction id
        """
        market_instance = self.get_object(company_id, transaction_date, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)


class StockPricesYearAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, year, position, user_id):
        prices = StockPrice.objects.filter(
            company=company_id, transaction_date__year=year, user=user_id
        )

        try:
            price_return = None
            if position == "last":
                price_return = prices.last()
            elif position == "first":
                price_return = prices.first()
            return price_return
        except StockPrice.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_stock_prices"])
    def get(self, request, company_id, year, position, *args, **kwargs):
        """
        Get the first or last stock price of a company for a given year

        - position: first|last

        """
        instance = self.get_object(company_id, year, position, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StockPriceSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
