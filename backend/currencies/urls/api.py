# type: ignore
from currencies.views import api
from django.urls import path

urlpatterns = [
    path(
        "",
        api.CurrencyViewSet.as_view({"get": "list", "post": "create"}),
        name="currency-list",
    ),
    path(
        "<int:currency_id>/",
        api.CurrencyViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="currency-detail",
    ),
]
