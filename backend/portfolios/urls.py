from django.urls import path
from portfolios import views
from companies import views as company_views
from log_messages import views as log_views

urlpatterns = [
    path("", views.PortfoliosListAPIView.as_view(), name="portfolio-list"),
    path("<int:portfolio_id>/", views.PortfolioDetailAPIView.as_view(), name="portfolio-detail"),
    path("<int:portfolio_id>/companies/", company_views.CompaniesListAPIView.as_view()),
    path(
        "<int:portfolio_id>/companies/<int:company_id>/",
        company_views.CompanyDetailAPIView.as_view(),
    ),
    path("<int:portfolio_id>/messages/", log_views.LogMessageListAPIView.as_view()),
    path(
        "<int:portfolio_id>/messages/<int:message_id>/",
        log_views.LogMessageDetailAPIView.as_view(),
    ),
]
