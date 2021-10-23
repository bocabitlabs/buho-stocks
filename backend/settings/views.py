from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from settings.models import UserSettings
from settings.serializers import UserSettingsSerializer

# Create your views here.


class UserSettingsListAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # test
    # 1. List all
    def get(self, request, *args, **kwargs):
        '''
        List all the market items for given requested user
        '''
        todo = UserSettings.objects.get(user=request.user.id)
        serializer = UserSettingsSerializer(todo)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(request_body=UserSettingsSerializer)
    def post(self, request, *args, **kwargs):
        '''
        Create the Market with given market data
        '''
        data = {
            'task': request.data.get('task'),
            'completed': request.data.get('completed'),
            'user': request.user.id
        }
        serializer = UserSettingsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSettingsDetailAPIView(APIView):
    # add permission to check if user is authenticated
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, todo_id, user_id):
        '''
        Helper method to get the object with given todo_id, and user_id
        '''
        try:
            return UserSettings.objects.get(id=todo_id, user=user_id)
        except UserSettings.DoesNotExist:
            return None

    # 3. Retrieve
    def get(self, request, market_id, *args, **kwargs):
        '''
        Retrieves the Todo with given todo_id
        '''
        todo_instance = self.get_object(market_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSettingsSerializer(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(request_body=UserSettingsSerializer)
    def put(self, request, settings_id, *args, **kwargs):
        '''
        Updates the settings item with given todo_id if exists
        '''
        todo_instance = self.get_object(settings_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with settings id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'company_display_mode': request.data.get('company_display_mode'),
            'company_sort_by': request.data.get('company_sort_by'),
            'language': request.data.get('language'),
            'main_portfolio': request.data.get('main_portfolio'),
            'portfolio_sort_by': request.data.get('portfolio_sort_by'),
            'portfolio_display_mode': request.data.get('portfolio_display_mode')
        }
        serializer = UserSettingsSerializer(
            instance=todo_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
