import logging

from shares_transactions.models import SharesTransaction

logger = logging.getLogger("buho_backend")


def get_portfolio_first_year(portfolio_id):
    query = SharesTransaction.objects.filter(
        company__portfolio=portfolio_id, company__is_closed=False
    ).order_by("transaction_date")
    if query.exists():
        return query[0].transaction_date.year
    return None
