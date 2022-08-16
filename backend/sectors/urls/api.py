from django.urls import path
from sectors.views import api

urlpatterns = [
    path(
        "",
        api.SectorViewSet.as_view({"get": "list", "post": "create"}),
        name="sector-list",
    ),
    path(
        "<int:sector_id>/",
        api.SectorViewSet.as_view(
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
        api.SuperSectorViewSet.as_view({"get": "list", "post": "create"}),
        name="super-sector-list",
    ),
    path(
        "super/<int:sector_id>/",
        api.SuperSectorViewSet.as_view(
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
