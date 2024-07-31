from django.urls import path
from rest_framework.routers import DefaultRouter

from log_messages import views

router = DefaultRouter()

urlpatterns = [
    path(
        "",
        views.LogMessageViewSet.as_view({"get": "list"}),
        name="message-list",
    ),
    path(
        "<int:id>/",
        views.LogMessageViewSet.as_view(
            {
                "delete": "destroy",
            }
        ),
        name="message-detail",
    ),
]
