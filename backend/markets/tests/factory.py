from factory import django, Faker

from markets.models import Market


class MarketFactory(django.DjangoModelFactory):
    class Meta:
        model = Market

    name = Faker("company")
    description = Faker("paragraph")
    region = Faker("country")
    open_time = Faker("time")
    close_time = Faker("time")
