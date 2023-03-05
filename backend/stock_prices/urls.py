from django.urls import path
from stock_prices import views as stock_prices_views

urlpatterns = [
    path(
        "<int:year>/",
        stock_prices_views.StockPricesYearAPIView.as_view(),
        name="stock-prices-year",
    ),
]
