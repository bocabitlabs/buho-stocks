from django.urls import path
from portfolios import views

urlpatterns = [
    path("", views.PortfolioListCreateAPIView.as_view(), name="portfolio-list"),
    path("<int:portfolio_id>/", views.PortfolioDetailAPIView.as_view(), name="portfolio-detail"),
]
