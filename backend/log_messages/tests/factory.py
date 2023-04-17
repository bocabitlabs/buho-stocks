from factory import Faker, SubFactory, django
from log_messages.models import LogMessage
from portfolios.tests.factory import PortfolioFactory


class LogMessageFactory(django.DjangoModelFactory):
    class Meta:
        model = LogMessage

    message_type = Faker("company")
    message_text = Faker("paragraph")

    portfolio = SubFactory(PortfolioFactory)
