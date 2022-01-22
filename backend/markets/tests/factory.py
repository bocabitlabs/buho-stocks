from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory

from markets.models import Market

class MarketFactory(django.DjangoModelFactory):

    class Meta:
        model = Market

    name = Faker('company')
    description = Faker('paragraph')
    color = Faker('color')
    region = Faker('country')
    open_time = Faker('time')
    close_time = Faker('time')

    user = SubFactory(UserFactory, markets=[])
