from unicodedata import name
from django.urls import path
from exchange_rates import views

urlpatterns = [
    path("", views.ExchangeRateListAPIView.as_view(), name="exchange-rates-list"),
    path(
        "<str:exchange_from>/<str:exchange_to>/<date:exchange_date>/",
        views.ExchangeRateDetailAPIView.as_view(), name="exchange-rates-detail",
    ),
]
