from django.urls import path
from stats import views

urlpatterns = [
    path("company/<int:company_id>/year/<str:year>/", views.CompanyStatsAPIView.as_view()),
    path("company/<int:company_id>/year/<str:year>/force/", views.CompanyStatsForceAPIView.as_view()),
    path("portfolio/<int:portfolio_id>/year/<str:year>/", views.PortfolioStatsAPIView.as_view()),
]
