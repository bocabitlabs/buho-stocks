from django.urls import path
from stats import views

urlpatterns = [
    path("<int:company_id>/<str:year>/", views.CompanyStatsAPIView.as_view()),
    path("<int:company_id>/<str:year>/force/", views.CompanyStatsForceAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/<str:year>/", views.PortfolioStatsAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/<str:year>/force/", views.PortfolioStatsForceAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/year/<str:year>/by-company/", views.PortfolioStatsByCompanyAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/year/<str:year>/monthly/", views.PortfolioDividendStatsMonthlyAPIView.as_view()),
]
