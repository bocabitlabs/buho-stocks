import datetime

from buho_backend.transaction_types import TransactionType
from companies.models import Company
from rights_transactions.tests.factory import RightsTransactionFactory


def create_first_rights_transaction(company: Company):
    """
    Total: 100
    Commission: 5
    Count: 10
    Args:
        company (Company): _description_

    Returns:
        _type_: _description_
    """
    first_datetime = datetime.datetime.strptime("2021-01-01", "%Y-%m-%d")
    RightsTransactionFactory.create(
        company=company,
        gross_price_per_share_currency=company.base_currency,
        total_commission_currency=company.base_currency,
        count=10,
        total_amount=100,
        type=TransactionType.BUY,
        gross_price_per_share=10,
        exchange_rate=1,
        total_commission=5,
        transaction_date=datetime.date(
            first_datetime.year, first_datetime.month, first_datetime.day
        ),
    )
    return first_datetime


def create_second_rights_transaction(company: Company):
    second_datetime = datetime.datetime.strptime("2022-01-01", "%Y-%m-%d")
    RightsTransactionFactory.create(
        company=company,
        gross_price_per_share_currency=company.base_currency,
        total_commission_currency=company.base_currency,
        count=10,
        total_amount=150,
        type=TransactionType.BUY,
        gross_price_per_share=10,
        exchange_rate=1,
        total_commission=10,
        transaction_date=datetime.date(
            second_datetime.year, second_datetime.month, second_datetime.day
        ),
    )
    return second_datetime


def create_third_rights_transaction(company: Company):
    third_datetime = datetime.datetime.strptime(
        f"{datetime.date.today().year}-01-01", "%Y-%m-%d"
    )
    RightsTransactionFactory.create(
        company=company,
        gross_price_per_share_currency=company.base_currency,
        total_commission_currency=company.base_currency,
        count=10,
        total_amount=200,
        type=TransactionType.BUY,
        gross_price_per_share=10,
        exchange_rate=1,
        total_commission=20,
        transaction_date=datetime.date(
            third_datetime.year, third_datetime.month, third_datetime.day
        ),
    )

    return third_datetime


def create_first_rights_sales_transaction(company: Company):
    transaction_date = datetime.datetime.strptime("2022-01-01", "%Y-%m-%d")
    RightsTransactionFactory.create(
        company=company,
        gross_price_per_share_currency=company.base_currency,
        total_commission_currency=company.base_currency,
        count=10,
        total_amount=100,
        type=TransactionType.SELL,
        gross_price_per_share=10,
        exchange_rate=1,
        total_commission=5,
        transaction_date=datetime.date(
            transaction_date.year, transaction_date.month, transaction_date.day
        ),
    )
    return transaction_date


def create_second_rights_sales_transaction(company: Company):
    transaction_date = datetime.datetime.strptime("2023-01-01", "%Y-%m-%d")
    RightsTransactionFactory.create(
        company=company,
        gross_price_per_share_currency=company.base_currency,
        total_commission_currency=company.base_currency,
        count=10,
        total_amount=150,
        type=TransactionType.SELL,
        gross_price_per_share=10,
        exchange_rate=1,
        total_commission=10,
        transaction_date=datetime.date(
            transaction_date.year, transaction_date.month, transaction_date.day
        ),
    )
    return transaction_date
