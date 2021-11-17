from django.urls import path
from shares_transactions import views

urlpatterns = [
    path("<int:company_id>/shares/", views.SharesTransactionsListAPIView.as_view()),
    path(
        "<int:company_id>/shares/<int:transaction_id>/",
        views.SharesTransactionDetailAPIView.as_view(),
    ),
]
