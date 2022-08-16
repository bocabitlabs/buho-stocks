from django.urls import path
from markets.views import api

urlpatterns = [
    path(
        "",
        api.MarketViewSet.as_view({"get": "list"}),
        name="market-list",
    ),
    path(
        "<int:market_id>/",
        api.MarketViewSet.as_view(
            {
                "get": "retrieve",
            }
        ),
        name="market-detail",
    ),
    path("timezones/", api.TimezoneList.as_view(), name="timezone-list"),
]
