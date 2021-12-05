from django.urls import path
from exchange_rates import views

urlpatterns = [
    path("", views.ExchangeRateListAPIView.as_view()),
    path(
        "<str:exchange_from>/<str:exchange_to>/<date:exchange_date>/",
        views.ExchangeRateDetailAPIView.as_view(),
    ),
]
