# type: ignore
from django.urls import path
from rest_framework.routers import DefaultRouter

from markets import views

router = DefaultRouter()

router.register(r"markets", views.MarketViewSet, basename="markets")

urlpatterns = [
    path("timezones/", views.TimezoneList.as_view(), name="timezone-list"),
]
