from factory import django, Faker, SubFactory, RelatedFactory, RelatedFactoryList, post_generation
from auth.tests.factory import UserFactory
from sectors.models import Sector, SuperSector
import random


class SectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)
    # super_sector = SubFactory('sectors.tests.factory.SuperSectorFactory')
    # super_sector = SubFactory("sectors.tests.factory.SuperSectorWithSectorsFactory", sectors=[])

class SectorWithSuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = Sector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)
    super_sector = SubFactory('sectors.tests.factory.SuperSectorFactory')

    # @post_generation
    # def create_super_sector(obj, create, other, **kwargs):
    #   print(f"create_super_sector: {obj} {create} {other} {kwargs}")
    #   if not create: return
    #   super_sec = SectorFactory().create()
    #   obj.super_sector = super_sec
    #   obj.save()

class SuperSectorFactory(django.DjangoModelFactory):
    class Meta:
        model = SuperSector

    name = Faker("company")
    color = Faker("color")

    user = SubFactory(UserFactory)

    # @post_generation
    # def sectors(obj, create, extracted, **kwargs):
    #     """
    #     If called like: SuperSectorFactory(sectors=4) it generates a SuperSector with 4
    #     sectors.  If called without `sectors` argument, it generates a
    #     random amount of players for this team
    #     """
    #     if not create:
    #         # Build, not create related
    #         return

    #     if extracted:
    #         for _ in range(extracted):
    #             SectorWithSuperSectorFactory(super_sector=obj)
    #     else:
    #         number_of_units = random.randint(1, 10)
    #         for _ in range(number_of_units):
    #             SectorWithSuperSectorFactory(super_sector=obj)

    # sectors = RelatedFactoryList(
    #     "sectors.tests.factory.Sector",
    #     # We can't provide ourself there, since we aren't saved to the database yet.
    #     factory_related_name="super_sector",
    # )

# class SuperSectorWithSectorsFactory(SuperSectorFactory):
#   @post_generation
#   def sectors(super_sector, create, num_sectors, **kwargs):
#     if not create: return
#     if num_sectors is None: num_sectors = 1

#     for n in range(num_sectors):
#       SectorFactory(super_sector=super_sector)

