# type: ignore

# type: ignore
from django.urls import path

from initialize_data import views

urlpatterns = [
    path("markets/", views.InitializeMarketsView.as_view(), name="initialize_markets"),
    path(
        "benchmarks/",
        views.InitializeBenchmarksView.as_view(),
        name="initialize_benchmarks",
    ),
    path("sectors/", views.InitializeSectorsView.as_view(), name="initialize_sectors"),
    path(
        "currencies/",
        views.InitializeCurrenciesView.as_view(),
        name="initialize_currencies",
    ),
]
