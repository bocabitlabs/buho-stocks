from dividends_transactions import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"dividends", views.DividendsViewSet, basename="dividends")
