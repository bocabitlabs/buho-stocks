from benchmarks import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"benchmarks", views.BenchmarkViewSet, basename="benchmarks")
router.register(r"benchmarks-years", views.BenchmarkYearViewSet, basename="benchmarks_years")
