from django.urls import path
from benchmarks.views import api

urlpatterns = [
    path(
        "",
        api.BenchmarkAPIView.as_view(),
        name="benchmarks-list",
    ),
    path(
        "<int:benchmark_id>/",
        api.BenchmarkYearsAPIView.as_view(),
        name="benchmark-years-list",
    ),
]
