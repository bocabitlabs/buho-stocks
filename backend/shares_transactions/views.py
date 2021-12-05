from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from shares_transactions.models import SharesTransaction
from shares_transactions.serializers import SharesTransactionSerializer


class SharesTransactionsListAPIView(APIView):
    """Get all the shares transactions from a user's company"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["company_shares"])
    def get(self, request, company_id, *args, **kwargs):
        """
        List all the company items for given requested user
        """
        elements = SharesTransaction.objects.filter(
            user=request.user.id, company=company_id
        )
        serializer = SharesTransactionSerializer(
            elements, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(
        tags=["company_shares"], request_body=SharesTransactionSerializer
    )
    def post(self, request, company_id, *args, **kwargs):
        """
        Create a shares transaction with given data
        """
        data = {
            "count": request.data.get("count"),
            "color": request.data.get("color"),
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "type": request.data.get("type"),
            "gross_price_per_share": request.data.get("gross_price_per_share"),
            "gross_price_per_share_currency": request.data.get(
                "gross_price_per_share_currency"
            ),
            "total_commission": request.data.get("total_commission"),
            "total_commission_currency": request.data.get("total_commission_currency"),
            "notes": request.data.get("notes"),
            "company": company_id,
        }

        serializer = SharesTransactionSerializer(
            data=data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SharesTransactionDetailAPIView(APIView):
    """Operations for a single Shares Transaction"""

    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, company_id, transaction_id, user_id):
        """
        Get a market object from a user given the portfolio id
        """
        try:
            return SharesTransaction.objects.get(
                id=transaction_id, company=company_id, user=user_id
            )
        except SharesTransaction.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["company_shares"])
    def get(self, request, company_id, transaction_id, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        print(company_id)
        print(transaction_id)
        instance = self.get_object(company_id, transaction_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SharesTransactionSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(
        tags=["company_shares"], request_body=SharesTransactionSerializer
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
            "count": request.data.get("count"),
            "color": request.data.get("color"),
            "exchange_rate": request.data.get("exchange_rate"),
            "transaction_date": request.data.get("transaction_date"),
            "type": request.data.get("type"),
            "gross_price_per_share": request.data.get("gross_price_per_share"),
            "gross_price_per_share_currency": request.data.get(
                "gross_price_per_share_currency"
            ),
            "total_commission": request.data.get("total_commission"),
            "total_commission_currency": request.data.get("total_commission_currency"),
            "notes": request.data.get("notes"),
            "company": company_id,
        }
        serializer = SharesTransactionSerializer(
            instance=instance, data=data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["company_shares"])
    def delete(self, request, company_id, transaction_id, *args, **kwargs):
        """
        Delete the company item with given transaction id
        """
        market_instance = self.get_object(transaction_id, company_id, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
