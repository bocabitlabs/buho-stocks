# type: ignore
from django.urls import path

from stats.views.company_stats import CompanyStatsAPIView
from stats.views.portfolio_stats import PortfolioStatsAllYearsAPIView, PortfolioStatsAPIView

urlpatterns = [
    path("portfolio/<int:portfolio_id>/", PortfolioStatsAllYearsAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/year/<str:year>/", PortfolioStatsAPIView.as_view()),
    path("company/<int:company_id>/year/<str:year>/", CompanyStatsAPIView.as_view()),
]
