from django.urls import path
from settings import views

urlpatterns = [
    path("", views.UserSettingsListAPIView.as_view()),
    path("<int:settings_id>/", views.UserSettingsDetailAPIView.as_view()),
    # path("delete/<int:pk>/",views.DeleteTodoAPIView.as_view(),name="delete_todo")
]
