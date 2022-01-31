from factory import django, Faker

from stock_prices.models import StockPrice

class StockPriceTransactionFactory(django.DjangoModelFactory):
    class Meta:
        model = StockPrice

    company_name = Faker("company")
    price = Faker('pydecimal', left_digits=4, right_digits=3, positive=True)
    transaction_date = Faker('date_object')
    ticker = Faker("pystr", max_chars=4)
