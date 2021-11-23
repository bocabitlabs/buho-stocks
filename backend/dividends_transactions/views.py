from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from dividends_transactions.models import DividendsTransaction
from dividends_transactions.serializers import DividendsTransactionSerializer


class DividendsTransactionsListAPIView(APIView):
    """Get all the shares transactions from a user's company"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["company_dividends"])
    def get(self, request, company_id, *args, **kwargs):
        """
        List all the company items for given requested user
        """
        elements = DividendsTransaction.objects.filter(
            user=request.user.id, company=company_id
        )
        serializer = DividendsTransactionSerializer(elements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(
        tags=["company_dividends"], request_body=DividendsTransactionSerializer
    )
    def post(self, request, company_id, *args, **kwargs):
        """
        Create a shares transaction with given data
        """
        data = {
            "name": request.data.get("name"),
            "count": request.data.get("count"),
            "color": request.data.get("color"),
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "type": request.data.get("type"),
            "price_per_share": request.data.get("price_per_share"),
            "total_commission": request.data.get("total_commission"),
            "notes": request.data.get("notes"),
            "company": company_id,
        }
        serializer = DividendsTransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DividendsTransactionDetailAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, transaction_id, company_id, user_id):
        """
        Get a market object from a user given the portfolio id
        """
        try:
            return DividendsTransaction.objects.get(
                id=transaction_id, company=company_id, user=user_id
            )
        except DividendsTransaction.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_dividends"])
    def get(self, request, company_id, transaction_id, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        instance = self.get_object(transaction_id, company_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = DividendsTransactionSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(
        tags=["company_dividends"], request_body=DividendsTransactionSerializer
    )
    def put(self, request, company_id, transaction_id, *args, **kwargs):
        """
        Update the company item with given company_id
        """
        instance = self.get_object(transaction_id, company_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "count": request.data.get("count"),
            "color": request.data.get("color"),
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "type": request.data.get("type"),
            "price_per_share": request.data.get("price_per_share"),
            "total_commission": request.data.get("total_commission"),
            "notes": request.data.get("notes"),
            "company": company_id,
        }
        serializer = DividendsTransactionSerializer(
            instance=instance, data=data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["company_dividends"])
    def delete(self, request, company_id, transaction_id, *args, **kwargs):
        """
        Delete the item with given transaction id
        """
        market_instance = self.get_object(transaction_id, company_id, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
