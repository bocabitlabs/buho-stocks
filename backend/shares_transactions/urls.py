from django.urls import path
from shares_transactions import views

urlpatterns = [
    path("", views.SharesTransactionsListAPIView.as_view(), name="shares-transaction-list"),
    path(
        "<int:transaction_id>/",
        views.SharesTransactionDetailAPIView.as_view(), name="shares-transaction-detail",
    ),
]