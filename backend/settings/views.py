import logging

from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from settings.models import UserSettings
from settings.serializers import UserSettingsSerializer

logger = logging.getLogger("buho_backend")


class UserSettingsDetailAPIView(APIView):
    def get_object(self) -> UserSettings | None:
        """
        Helper method to get the application settings object
        """
        try:
            result: tuple[UserSettings, bool] = UserSettings.objects.get_or_create(pk=1)
            return result[0]
        except UserSettings.DoesNotExist:
            return None

    @swagger_auto_schema(tags=["settings"])
    def get(self, request, *args, **kwargs) -> Response:
        """
        Retrieves the Todo with given todo_id
        """
        settings_instance = self.get_object()
        if not settings_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UserSettingsSerializer(settings_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["settings"], request_body=UserSettingsSerializer)
    def put(self, request, *args, **kwargs) -> Response:
        """
        Updates the settings item with given todo_id if exists
        """
        todo_instance = self.get_object()
        if not todo_instance:
            return Response(
                {"res": "Object with settings id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UserSettingsSerializer(
            instance=todo_instance, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
