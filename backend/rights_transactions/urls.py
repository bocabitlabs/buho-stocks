from rest_framework.routers import DefaultRouter

from rights_transactions import views

router = DefaultRouter()

router.register(r"rights", views.RightsViewSet, basename="rights")
