from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from currencies.serializers import CurrencySerializer
from currencies.models import Currency


class CurrencyListAPIView(APIView):
    """Get all the currencies from a user"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["currencies"])
    def get(self, request, *args, **kwargs):
        """
        List all the currency items for given requested user
        """
        elements = Currency.objects.filter(user=request.user.id)
        serializer = CurrencySerializer(elements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(tags=["currencies"], request_body=CurrencySerializer)
    def post(self, request, *args, **kwargs):
        """
        Create the Currency with given currency data
        """
        data = {
            "name": request.data.get("name"),
            "abbreviation": request.data.get("abbreviation"),
            "color": request.data.get("color"),
            "country": request.data.get("country"),
            "symbol": request.data.get("symbol"),
        }
        serializer = CurrencySerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrencyDetailAPIView(APIView):
    """Operations for a single Currency"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, currency_id, user_id):
        """
        Get a currency object from a user given the currency id
        """
        try:
            return Currency.objects.get(id=currency_id, user=user_id)
        except Currency.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["currencies"])
    def get(self, request, currency_id, *args, **kwargs):
        """
        Retrieve the currency item with given currency_id
        """
        instance = self.get_object(currency_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with currency id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CurrencySerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["currencies"], request_body=CurrencySerializer)
    def put(self, request, currency_id, *args, **kwargs):
        """
        Update the currency item with given currency_id
        """
        instance = self.get_object(currency_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with currency id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "abbreviation": request.data.get("description"),
            "color": request.data.get("color"),
            "country": request.data.get("country"),
            "symbol": request.data.get("symbol"),
        }
        serializer = CurrencySerializer(instance=instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["currencies"])
    def delete(self, request, currency_id, *args, **kwargs):
        """
        Delete the currency item with given currency_id
        """
        currency_instance = self.get_object(currency_id, request.user.id)
        if not currency_instance:
            return Response(
                {"res": "Object with currency id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        currency_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
