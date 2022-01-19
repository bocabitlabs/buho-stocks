from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from log_messages.models import LogMessage
from log_messages.serializers import LogMessageSerializer


class LogMessageListAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["messages_log"])
    def get(self, request, portfolio_id, *args, **kwargs):
        items = LogMessage.objects.filter(
            user=request.user.id, portfolio=portfolio_id
        ).order_by("-date_created")
        serializer = LogMessageSerializer(
            items, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogMessageDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, message_id, user_id):
        try:
            return LogMessage.objects.get(
                id=message_id, portfolio=portfolio_id, user=user_id
            )
        except LogMessage.DoesNotExist:
            return None

    # 5. Delete
    @swagger_auto_schema(tags=["messages_log"])
    def delete(self, request, portfolio_id, message_id, *args, **kwargs):
        instance = self.get_object(portfolio_id, message_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Message with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.delete()
        return Response({"res": "Message deleted!"}, status=status.HTTP_200_OK)
