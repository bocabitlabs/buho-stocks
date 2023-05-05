from factory import Faker, django
from settings.models import UserSettings


class UserSettingsFactory(django.DjangoModelFactory):
    class Meta:
        model = UserSettings

    language = Faker("language_code")
