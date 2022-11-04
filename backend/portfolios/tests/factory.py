import random
from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory
from portfolios.models import Portfolio


class PortfolioFactory(django.DjangoModelFactory):
    class Meta:
        model = Portfolio

    name = Faker("company")
    color = Faker("color")
    description = Faker("paragraph")
    base_currency = "EUR"
    country_code = Faker("country_code")
    hide_closed_companies = Faker("boolean")

    user = SubFactory(UserFactory)
