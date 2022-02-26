from django.urls import path
from shares_transactions import views

urlpatterns = [
    path("", views.SharesTransactionListCreateAPIView.as_view(), name="shares-transaction-list"),
    path(
        "<int:transaction_id>/",
        views.SharesTransactionDetailsDetailAPIView.as_view(), name="shares-transaction-detail",
    ),
]