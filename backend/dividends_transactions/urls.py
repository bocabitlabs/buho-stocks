from django.urls import path
from dividends_transactions import views as dividends_views

urlpatterns = [
    path(
        "",
        dividends_views.DividendsTransactionsListAPIView.as_view(), name="dividends-transaction-list",
    ),
    path(
        "<int:transaction_id>/",
        dividends_views.DividendsTransactionDetailAPIView.as_view(), name="dividends-transaction-detail",
    ),
]