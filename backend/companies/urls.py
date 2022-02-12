from django.urls import path
from companies import views as company_views

urlpatterns = [
    path("", company_views.CompanyListCreateAPIView.as_view(), name="company-list"),
    path(
        "<int:company_id>/",
        company_views.CompanyDetailAPIView.as_view(), name="company-detail",
    ),
]