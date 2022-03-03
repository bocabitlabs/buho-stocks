from django.urls import path
from markets import views

urlpatterns = [
    path("", views.MarketViewSet.as_view({"get": "list", "post": "create"}), name="market-list"),
    path("<int:market_id>/", views.MarketViewSet.as_view({
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }), name="market-detail"),
]
