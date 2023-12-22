from django.urls import path

from log_messages import views as log_views

urlpatterns = [
    path("", log_views.LogMessageListAPIView.as_view(), name="log-message-list"),
    path(
        "<int:message_id>/",
        log_views.LogMessageDetailAPIView.as_view(),
        name="log-message-detail",
    ),
]
