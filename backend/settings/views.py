import logging

from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from settings.models import UserSettings
from settings.serializers import UserSettingsSerializer

logger = logging.getLogger("buho_backend")


class UserSettingsDetailAPIView(APIView):
    # add permission to check if user is authenticated

    def get_object(self) -> UserSettings | None:
        """
        Helper method to get the object with given todo_id
        """
        try:
            settings, _ = UserSettings.objects.get_or_create(pk=1)
            return settings
        except UserSettings.DoesNotExist:
            return None

    # 3. Retrieve
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

    # 4. Update
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
        data = {
            "companyDisplayMode": request.data.get("companyDisplayMode"),
            "companySortBy": request.data.get("companySortBy"),
            "language": request.data.get("language"),
            "timezone": request.data.get("timezone"),
            "mainPortfolio": request.data.get("mainPortfolio"),
            "portfolioSortBy": request.data.get("portfolioSortBy"),
            "portfolioDisplayMode": request.data.get("portfolioDisplayMode"),
            "sentry_dsn": request.data.get("sentry_dsn"),
            "sentry_enabled": request.data.get("sentry_enabled"),
            "backend_hostname": request.data.get("backend_hostname"),
        }
        serializer = UserSettingsSerializer(instance=todo_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
