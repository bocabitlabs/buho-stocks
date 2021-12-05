from django.urls import path
from shares_transactions import views
from rights_transactions import views as rights_views
from dividends_transactions import views as dividends_views
from stock_prices import views as stock_prices_views

urlpatterns = [
    path("<int:company_id>/shares/", views.SharesTransactionsListAPIView.as_view()),
    path(
        "<int:company_id>/shares/<int:transaction_id>/",
        views.SharesTransactionDetailAPIView.as_view(),
    ),
    path(
        "<int:company_id>/rights/", rights_views.RightsTransactionsListAPIView.as_view()
    ),
    path(
        "<int:company_id>/rights/<int:transaction_id>/",
        rights_views.RightsTransactionDetailAPIView.as_view(),
    ),
    path(
        "<int:company_id>/dividends/",
        dividends_views.DividendsTransactionsListAPIView.as_view(),
    ),
    path(
        "<int:company_id>/dividends/<int:transaction_id>/",
        dividends_views.DividendsTransactionDetailAPIView.as_view(),
    ),
    path(
        "<int:company_id>/stock-prices/",
        stock_prices_views.StockPricesListAPIView.as_view(),
    ),
    path(
        "<int:company_id>/stock-prices/<date:transaction_date>/",
        stock_prices_views.StockPricesDetailAPIView.as_view(),
    ),
    path(
        "<int:company_id>/stock-prices/<int:year>/<str:position>/",
        stock_prices_views.StockPricesYearAPIView.as_view(),
    ),
]
