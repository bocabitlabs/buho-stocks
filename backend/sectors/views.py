# from django.contrib.auth.models import User, Group
from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from sectors.serializers import SectorSerializer, SectorSerializerGet, SuperSectorSerializer
from sectors.models import Sector, SuperSector


class SectorListAPIView(APIView):
    # add permission to check if user is authenticated
    # permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    def get(self, request, *args, **kwargs):
        """
        List all the market items for given requested user
        """
        sectors = Sector.objects.filter(user=request.user.id)
        serializer = SectorSerializerGet(sectors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(request_body=SectorSerializer)
    def post(self, request, *args, **kwargs):
        """
        Create the Sector with given market data
        """
        print(request.data)
        data = {
            "name": request.data.get("name"),
            "color": request.data.get("color"),
            "super_sector": request.data.get("superSector") or request.data.get("super_sector")
        }
        print(data)
        serializer = SectorSerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SectorDetailAPIView(APIView):
    # add permission to check if user is authenticated
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, todo_id, user_id):
        """
        Helper method to get the object with given todo_id, and user_id
        """
        try:
            return Sector.objects.get(id=todo_id, user=user_id)
        except Sector.DoesNotExist:
            return None

    # 3. Retrieve
    def get(self, request, sector_id, *args, **kwargs):
        """
        Retrieves the Todo with given todo_id
        """
        todo_instance = self.get_object(sector_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SectorSerializerGet(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(request_body=SectorSerializer)
    def put(self, request, sector_id, *args, **kwargs):
        """
        Updates the todo item with given todo_id if exists
        """
        todo_instance = self.get_object(sector_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "color": request.data.get("color"),
            "super_sector": request.data.get("superSector") or request.data.get("super_sector")
        }
        serializer = SectorSerializer(instance=todo_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    def delete(self, request, sector_id, *args, **kwargs):
        """
        Deletes the todo item with given todo_id if exists
        """
        market_instance = self.get_object(sector_id, request.user.id)
        if not market_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        market_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)

class SuperSectorListAPIView(APIView):
    # add permission to check if user is authenticated
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    def get(self, request, *args, **kwargs):
        """
        List all the market items for given requested user
        """
        sectors = SuperSector.objects.filter(user=request.user.id)
        serializer = SuperSectorSerializer(sectors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    @swagger_auto_schema(request_body=SuperSectorSerializer)
    def post(self, request, *args, **kwargs):
        """
        Create the Sector with given market data
        """
        data = {
            "name": request.data.get("name"),
            "color": request.data.get("color"),
        }
        serializer = SuperSectorSerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SuperSectorDetailAPIView(APIView):
    # add permission to check if user is authenticated
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, todo_id, user_id):
        """
        Helper method to get the object with given todo_id, and user_id
        """
        try:
            return SuperSector.objects.get(id=todo_id, user=user_id)
        except Sector.DoesNotExist:
            return None

    # 3. Retrieve
    def get(self, request, sector_id, *args, **kwargs):
        """
        Retrieves the Todo with given todo_id
        """
        todo_instance = self.get_object(sector_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SuperSectorSerializer(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(request_body=SuperSectorSerializer)
    def put(self, request, sector_id, *args, **kwargs):
        """
        Updates the todo item with given todo_id if exists
        """
        todo_instance = self.get_object(sector_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "name": request.data.get("name"),
            "color": request.data.get("color")
        }
        serializer = SuperSectorSerializer(instance=todo_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    def delete(self, request, sector_id, *args, **kwargs):
        """
        Deletes the todo item with given todo_id if exists
        """
        sector_instance = self.get_object(sector_id, request.user.id)
        if not sector_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        sector_instance.delete()
        return Response({"res": "Object deleted!"}, status=status.HTTP_200_OK)