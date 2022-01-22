from unicodedata import name
from django.urls import path
from markets import views

urlpatterns = [
    path("", views.MarketListAPIView.as_view(), name="market-list"),
    path("<int:market_id>/", views.MarketDetailAPIView.as_view(), name="market-detail"),
]
