from django.urls import path
from portfolios import views
from companies import views as company_views

urlpatterns = [
    path("", views.PortfoliosListAPIView.as_view()),
    path("<int:portfolio_id>/", views.PortfolioDetailAPIView.as_view()),
    path("", views.PortfoliosListAPIView.as_view()),
    path("<int:portfolio_id>/companies/", company_views.CompaniesListAPIView.as_view()),
    path(
        "<int:portfolio_id>/companies/<int:company_id>/",
        company_views.CompanyDetailAPIView.as_view(),
    ),
]
