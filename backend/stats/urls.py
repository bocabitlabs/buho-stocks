from django.urls import path
from stats import views

urlpatterns = [
    path("<int:company_id>/<str:year>/", views.CompanyStatsAPIView.as_view()),
    path("company-first-year/<int:company_id>/", views.CompanyStatsYearsAPIView.as_view()),
    path("portfolio-first-year/<int:portfolio_id>/", views.PortfolioStatsYearsAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/<str:year>/", views.PortfolioStatsAPIView.as_view()),
]
