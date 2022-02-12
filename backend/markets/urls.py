from django.urls import path
from markets import views

urlpatterns = [
    path("", views.MarketListCreateAPIView.as_view(), name="market-list"),
    path("<int:market_id>/", views.MarketDetailAPIView.as_view(), name="market-detail"),
]
