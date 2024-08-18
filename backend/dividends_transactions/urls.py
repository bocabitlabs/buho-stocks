from rest_framework.routers import DefaultRouter

from dividends_transactions import views

router = DefaultRouter()

router.register(r"dividends", views.DividendsViewSet, basename="dividends")
