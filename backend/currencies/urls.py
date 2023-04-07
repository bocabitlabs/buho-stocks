# type: ignore
from currencies import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"currencies", views.CurrencyViewSet, basename="currencies")
