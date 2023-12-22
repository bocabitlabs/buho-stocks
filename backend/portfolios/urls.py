from django.urls import path

from portfolios import views

urlpatterns = [
    path("", views.PortfolioViewSet.as_view({"get": "list", "post": "create"}), name="portfolio-list"),
    path(
        "<int:portfolio_id>/",
        views.PortfolioViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="portfolio-detail",
    ),
]
