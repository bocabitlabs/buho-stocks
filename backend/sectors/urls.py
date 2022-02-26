from django.urls import path
from sectors import views

urlpatterns = [
    path(
        "",
        views.SectorViewSet.as_view({"get": "list", "post": "create"}),
        name="sector-list",
    ),
    path(
        "<int:sector_id>/",
        views.SectorViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="sector-detail",
    ),
    path(
        "super/",
        views.SuperSectorViewSet.as_view({"get": "list", "post": "create"}),
        name="super-sector-list",
    ),
    path(
        "super/<int:sector_id>/",
        views.SuperSectorViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="super-sector-detail",
    ),
]
