from django.urls import path
from exchange_rates import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"exchange-rates", views.ExchangeRateViewSet, basename="exchange_rates")

urlpatterns = [
    path(
        "<str:exchange_from>/<str:exchange_to>/<str:exchange_date>/",
        views.ExchangeRateDetailAPIView.as_view(),  # type: ignore
        name="exchange-rates-detail",
    ),
]
