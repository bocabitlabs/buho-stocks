from factory import Faker, SubFactory, django

from sectors.models import Sector, SuperSector


class SectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")


class SectorWithSuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")
    super_sector = SubFactory("sectors.tests.factory.SuperSectorFactory")


class SuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = SuperSector

    name = Faker("company")
