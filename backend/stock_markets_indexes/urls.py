from django.urls import path
from stock_markets_indexes import views

urlpatterns = [
    path(
        "",
        views.StockMarketIndexAPIView.as_view(),
        name="stock-markets-indexes-list",
    ),
    path(
        "<int:index_id>/",
        views.StockMarketIndexYearsAPIView.as_view(),
        name="stock-market-index-years-list",
    ),
]
