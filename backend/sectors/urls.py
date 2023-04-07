# type: ignore
from rest_framework.routers import DefaultRouter
from sectors import views

router = DefaultRouter()

router.register(r"super-sectors", views.SuperSectorViewSet, basename="super_sectors")
router.register(r"sectors", views.SectorViewSet, basename="sectors")
