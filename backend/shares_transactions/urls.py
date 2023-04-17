from rest_framework.routers import DefaultRouter
from shares_transactions import views

router = DefaultRouter()

router.register(r"shares", views.SharesViewSet, basename="shares")
