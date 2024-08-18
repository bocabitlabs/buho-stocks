from shares_transactions.models import SharesTransaction


def get_company_first_year(company_id: int) -> int | None:
    query = SharesTransaction.objects.filter(company_id=company_id).order_by(
        "transaction_date"
    )
    if query.exists():
        first_transaction = query[0]
        year: int = first_transaction.transaction_date.year
        return year
    return None
