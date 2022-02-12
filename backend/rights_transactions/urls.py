from django.urls import path
from rights_transactions import views as rights_views

urlpatterns = [
    path(
        "",
        rights_views.RightsTransactionsListAPIView.as_view(),
        name="rights-transaction-list",
    ),
    path(
        "<int:transaction_id>/",
        rights_views.RightsTransactionDetailAPIView.as_view(),
        name="rights-transaction-detail",
    ),
]
