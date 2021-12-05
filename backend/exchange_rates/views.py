from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from exchange_rates.models import ExchangeRate
from exchange_rates.serializers import ExchangeRateSerializer
from forex_python.converter import CurrencyRates
import datetime


def get_exchange_rates_from_api(exchange_from, exchange_to, exchange_date):
    print("Call the exchange API")
    c = CurrencyRates()
    rates = c.get_rates(exchange_from, exchange_date)
    desired_exchange = None
    for key in rates:
        print(key, "->", rates[key])
        data = {
            "exchange_from": exchange_from,
            "exchange_to": key,
            "exchange_date": exchange_date,
            "exchange_rate": rates[key],
        }
        print(data)
        serializer = ExchangeRateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            if key == exchange_to:
                desired_exchange = serializer
        else:
            print(serializer)
            print("Serializer is not valid")
            print(serializer.errors)
    return desired_exchange


class ExchangeRateListAPIView(APIView):
    """Get all the exchange rates from a user"""

    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, *args, **kwargs):
        """
        List all the exchange_rates items for given requested user
        """
        todos = ExchangeRate.objects.all()
        serializer = ExchangeRateSerializer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # # 2. Create
    # @swagger_auto_schema(tags=["exchange_rates"], request_body=ExchangeRateSerializer)
    # def post(self, request, *args, **kwargs):
    #     """
    #     Create the Exchange rate with given market data
    #     """
    #     data = {
    #         "exchange_from": request.data.get("exchange_from"),
    #         "exchange_to": request.data.get("exchange_to"),
    #         "exchange_date": request.data.get("exchange_date"),
    #         "exchange_rate": request.data.get("exchange_rate"),
    #     }
    #     serializer = ExchangeRateSerializer(data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExchangeRateDetailAPIView(APIView):
    """Operations for a single Exchange rate"""

    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    # permission_classes = [IsAuthenticated]

    def get_object(self, exchange_from, exchange_to, exchange_date, user_id):
        try:
            return ExchangeRate.objects.get(
                exchange_from=exchange_from,
                exchange_to=exchange_to,
                exchange_date=exchange_date,
            )
        except ExchangeRate.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, exchange_from, exchange_to, exchange_date, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        todo_instance = self.get_object(
            exchange_from, exchange_to, exchange_date, request.user.id
        )
        if not todo_instance:
            serializer = get_exchange_rates_from_api(
                exchange_from, exchange_to, exchange_date
            )
            if not serializer:
                return Response(
                    {"res": "Exchange rate does not exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            serializer = ExchangeRateSerializer(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["exchange_rates"], request_body=ExchangeRateSerializer)
    def put(self, request, exchange_from, exchange_to, exchange_date, *args, **kwargs):
        """
        Update the market item with given market_id
        """
        todo_instance = self.get_object(
            exchange_from, exchange_to, exchange_date, request.user.id
        )
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "exchange_from": request.data.get("exchange_from"),
            "exchange_to": request.data.get("exchange_to"),
            "exchange_date": request.data.get("exchange_date"),
            "exchange_rate": request.data.get("exchange_rate"),
        }
        serializer = ExchangeRateSerializer(
            instance=todo_instance, data=data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["exchange_rates"])
    def delete(
        self, request, exchange_from, exchange_to, exchange_date, *args, **kwargs
    ):
        market_instance = self.get_object(
            exchange_from, exchange_to, exchange_date, request.user.id
        )
        if not market_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
