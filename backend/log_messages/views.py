from rest_framework.response import Response
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from log_messages.models import LogMessage
from log_messages.serializers import LogMessageSerializer


class LogMessageListAPIView(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication]
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

    # 2. Create
    @swagger_auto_schema(tags=["log_messages"], request_body=LogMessageSerializer)
    def post(self, request, portfolio_id, *args, **kwargs):
        data = {
            "message_type": request.data.get("message_type"),
            "message_text": request.data.get("message_text"),
            "portfolio": portfolio_id,
        }
        serializer = LogMessageSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogMessageDetailAPIView(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, portfolio_id, message_id, user_id):
        try:
            return LogMessage.objects.get(
                id=message_id, portfolio=portfolio_id, user=user_id
            )
        except LogMessage.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["log_messages"])
    def get(self, request, portfolio_id, message_id, *args, **kwargs):
        instance = self.get_object(portfolio_id, message_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Message with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = LogMessageSerializer(instance, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    @swagger_auto_schema(tags=["log_messages"], request_body=LogMessageSerializer)
    def put(self, request, portfolio_id, message_id, *args, **kwargs):
        todo_instance = self.get_object(portfolio_id, message_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Message with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "message_type": request.data.get("message_type"),
            "message_text": request.data.get("message_text"),
            "portfolio": portfolio_id,
        }
        serializer = LogMessageSerializer(
            instance=todo_instance,
            data=data,
            partial=True,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    @swagger_auto_schema(tags=["messages_log"])
    def delete(self, request, message_id, portfolio_id, *args, **kwargs):
        instance = self.get_object(message_id, portfolio_id, request.user.id)
        if not instance:
            return Response(
                {"res": "Message with id does not exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.delete()
        return Response({"res": "Message deleted!"}, status=status.HTTP_200_OK)
