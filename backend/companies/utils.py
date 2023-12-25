from shares_transactions.models import SharesTransaction


def get_company_first_year(company_id: int) -> int | None:
    query = SharesTransaction.objects.filter(company_id=company_id).order_by("transaction_date")
    if query.exists():
        return query[0].transaction_date.year
    return None
