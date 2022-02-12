from django.utils.decorators import method_decorator

from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status, generics
from drf_yasg.utils import swagger_auto_schema
from companies.serializers import CompanySerializer, CompanySerializerGet
from companies.models import Company
from log_messages.models import LogMessage
from portfolios.models import Portfolio
import logging

logger = logging.getLogger("buho_backend")


@method_decorator(
    name="get",
    decorator=swagger_auto_schema(
        operation_description="Get a list of companies of the current user",
        tags=["portfolio_companies"],
    ),
)
@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        operation_description="Create a new company for the current user",
        tags=["portfolio_companies"],
    ),
)
class CompanyListCreateAPIView(generics.ListCreateAPIView):
    """Get all the markets from a user"""

    serializer_class = CompanySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'portfolio_id'


    def get_queryset(self):
        user = self.request.user
        portfolio_id = self.kwargs.get("portfolio_id")
        return Company.objects.filter(user=user.id, portfolio=portfolio_id)

    def perform_create(self, serializer):
        portfolio_id = self.kwargs.get("portfolio_id")
        serializer.save(user=self.request.user)
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_CREATE_COMPANY,
            message_text=f"Company created: {serializer.data.get('name')} ({serializer.data.get('ticker')})",
            portfolio=Portfolio.objects.get(id=portfolio_id),
            user=self.request.user,
        )


# class CompaniesListAPIView(APIView):
#     """Get all the companies from a user's portfolio"""

#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     # 1. List all
#     @swagger_auto_schema(tags=["portfolio_companies"])
#     def get(self, request, portfolio_id, *args, **kwargs):
#         """
#         List all the portfolio items for given requested user
#         """
#         elements = Company.objects.filter(user=request.user.id, portfolio=portfolio_id)

#         serializer = CompanySerializerGet(
#             elements, many=True, context={"request": request}
#         )
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     # 2. Create
#     @swagger_auto_schema(tags=["portfolio_companies"], request_body=CompanySerializer)
#     def post(self, request, portfolio_id, *args, **kwargs):
#         """
#         Create the company with given portfolio data
#         """
#         data = {
#             "alt_tickers": request.data.get("alt_tickers"),
#             "base_currency": request.data.get("base_currency"),
#             "broker": request.data.get("broker"),
#             "color": request.data.get("color"),
#             "country_code": request.data.get("country_code"),
#             "description": request.data.get("description"),
#             "dividends_currency": request.data.get("dividends_currency"),
#             "is_closed": request.data.get("is_closed"),
#             "market": request.data.get("market"),
#             "name": request.data.get("name"),
#             "portfolio": portfolio_id,
#             "sector": request.data.get("sector"),
#             "ticker": request.data.get("ticker"),
#             "url": request.data.get("url"),
#         }
#         if request.data.get("logo"):
#             data["logo"] = request.data.get("logo")

#         serializer = CompanySerializer(data=data, context={"request": request})
#         if serializer.is_valid():
#             serializer.save(user=self.request.user)
#             LogMessage.objects.create(
#                 message_type=LogMessage.MESSAGE_TYPE_CREATE_COMPANY,
#                 message_text=f"Company created: {serializer.data.get('name')} ({serializer.data.get('ticker')})",
#                 portfolio=Portfolio.objects.get(id=portfolio_id),
#                 user=self.request.user,
#             )
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetailAPIView(APIView):
    """Operations for a single Company"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, company_id, user_id):
        try:
            return Company.objects.get(
                id=company_id, portfolio=portfolio_id, user=user_id
            )
        except Company.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["portfolio_companies"])
    def get(self, request, portfolio_id, company_id, *args, **kwargs):
        """
        Retrieve the company item with given company_id
        """
        instance = self.get_object(portfolio_id, company_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CompanySerializerGet(instance, context={"request": request})
        new_data = serializer.data

        return Response(new_data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["portfolio_companies"], request_body=CompanySerializer)
    def put(self, request, portfolio_id, company_id, *args, **kwargs):
        """
        Update the company item with given company_id
        """
        instance = self.get_object(portfolio_id, company_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Object with portfolio id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "alt_tickers": request.data.get("alt_tickers"),
            "base_currency": request.data.get("base_currency"),
            "broker": request.data.get("broker"),
            "color": request.data.get("color"),
            "country_code": request.data.get("country_code"),
            "description": request.data.get("description"),
            "dividends_currency": request.data.get("dividends_currency"),
            "is_closed": request.data.get("is_closed"),
            "market": request.data.get("market"),
            "name": request.data.get("name"),
            "portfolio": portfolio_id,
            "sector": request.data.get("sector"),
            "ticker": request.data.get("ticker"),
            "url": request.data.get("url"),
        }
        if request.data.get("logo"):
            data["logo"] = request.data.get("logo")
        serializer = CompanySerializer(
            instance=instance, data=data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["portfolio_companies"])
    def delete(self, request, portfolio_id, company_id, *args, **kwargs):
        """
        Delete the company item with given company_id
        """
        instance = self.get_object(portfolio_id, company_id, request.user.id)
        if not instance:
            return Response(
                {"res": f"Object with company id {company_id} does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.delete()
        LogMessage.objects.create(
            message_type=LogMessage.MESSAGE_TYPE_DELETE_COMPANY,
            message_text=f"Company deleted: {instance.name} ({instance.ticker})",
            portfolio=Portfolio.objects.get(id=portfolio_id),
            user=self.request.user,
        )
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)
