
from shares_transactions.models import SharesTransaction


class CompanyUtils:
    def get_company_first_year(self, company_id: int, user_id: int):
        query = SharesTransaction.objects.filter(
            company_id=company_id, user=user_id
        ).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None