from django.urls import path
from markets import views

urlpatterns = [
    path("", views.MarketListAPIView.as_view()),
    path("<int:market_id>/", views.MarketDetailAPIView.as_view()),
]
