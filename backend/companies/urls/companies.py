# type: ignore
from django.urls import path

from companies import views

urlpatterns = [
    path(
        "search/<str:ticker>/",
        views.CompanySearchAPIView.as_view(),
        name="companies-search",
    ),
]
