from django.urls import path

from settings import views

urlpatterns = [
    path("", views.UserSettingsDetailAPIView.as_view(), name="user-settings-detail"),
    # path("delete/<int:pk>/",views.DeleteTodoAPIView.as_view(),name="delete_todo")
]
