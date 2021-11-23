from django.urls import path
from shares_transactions import views
from rights_transactions import views as rights_views
from dividends_transactions import views as dividends_views

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
]
