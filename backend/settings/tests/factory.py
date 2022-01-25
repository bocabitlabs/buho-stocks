from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory

from settings.models import UserSettings

class UserSettingsFactory(django.DjangoModelFactory):

    class Meta:
        model = UserSettings

    language = Faker('language_code')

    user = SubFactory(UserFactory)
