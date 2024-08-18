from django.urls import path
from rest_framework.routers import DefaultRouter

from exchange_rates import views

router = DefaultRouter()

router.register(r"exchange-rates", views.ExchangeRateViewSet)

urlpatterns = [
    path(
        "<str:exchange_from>/<str:exchange_to>/<str:exchange_date>/",
        views.ExchangeRateDetailAPIView.as_view(),  # type: ignore
        name="exchange-rates-details",
    ),
]
