from django.urls import path
from currencies import views

urlpatterns = [
    path("", views.CurrencyListAPIView.as_view(), name="currency-list"),
]
