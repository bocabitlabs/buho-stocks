from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory
from sectors.models import Sector, SuperSector


class SectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)


class SectorWithSuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)
    super_sector = SubFactory('sectors.tests.factory.SuperSectorFactory')

class SuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = SuperSector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)
