# type: ignore
from django.urls import path

from companies import views as company_views

urlpatterns = [
    path(
        "",
        company_views.CompanyViewSet.as_view({"get": "list", "post": "create"}),
        name="company-list",
    ),
    path(
        "<int:company_id>/",
        company_views.CompanyViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="company-detail",
    ),
]
