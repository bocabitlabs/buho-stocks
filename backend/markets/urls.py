# type: ignore
from django.urls import path
from markets import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"markets", views.MarketViewSet, basename="markets")

urlpatterns = [
    path("timezones/", views.TimezoneList.as_view(), name="timezone-list"),
]
