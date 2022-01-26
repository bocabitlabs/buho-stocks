from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory
from log_messages.models import LogMessage


class LogMessageFactory(django.DjangoModelFactory):

    class Meta:
        model = LogMessage

    message_type = Faker('company')
    message_text = Faker('paragraph')

    user = SubFactory(UserFactory)