# type: ignore
from rest_framework.routers import DefaultRouter

from currencies import views

router = DefaultRouter()

router.register(r"currencies", views.CurrencyViewSet, basename="currencies")
