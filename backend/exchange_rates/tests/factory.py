from factory import Faker, django

from exchange_rates.models import ExchangeRate


class ExchangeRateFactory(django.DjangoModelFactory):
    class Meta:
        model = ExchangeRate

    exchange_from = Faker("currency_code")
    exchange_to = Faker("currency_code")
    exchange_rate = Faker("pydecimal", left_digits=1, right_digits=3, positive=True)
    exchange_date = Faker("date_object")
