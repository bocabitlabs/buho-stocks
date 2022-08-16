from django.urls import path
from currencies.views import api

urlpatterns = [
    path(
        "",
        api.CurrencyViewSet.as_view({"get": "list"}),
        name="currency-list",
    ),
    path(
        "<int:currency_id>/",
        api.CurrencyViewSet.as_view(
            {
                "get": "retrieve",
            }
        ),
        name="currency-detail",
    ),
]
