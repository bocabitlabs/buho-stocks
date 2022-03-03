from django.urls import path
from rights_transactions import views as rights_views

urlpatterns = [
    path(
        "",
        rights_views.RightsTransactionListCreateAPIView.as_view(),
        name="rights-transaction-list",
    ),
    path(
        "<int:transaction_id>/",
        rights_views.RightsTransactionDetailsDetailAPIView.as_view(),
        name="rights-transaction-detail",
    ),
]
