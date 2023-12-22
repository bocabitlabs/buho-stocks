from rest_framework.routers import DefaultRouter

from stock_prices import views

router = DefaultRouter()

router.register(r"stock-prices", views.ExchangeRateViewSet, basename="stock-prices")
