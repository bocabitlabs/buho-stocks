from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
import factory
from auth.tests.factory import UserFactory
from sectors.models import Sector, SuperSector
from sectors.tests.factory import (
    SectorFactory,
    SectorWithSuperSectorFactory,
    SuperSectorFactory,
)
import logging

logger = logging.getLogger("buho_backend")


class SectorsListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        cls.sectors_url = reverse("sector-list")
        cls.super_sectors_url = reverse("super-sector-list")
        cls.faker_obj = Faker()

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_sectors(self):
        response = self.client.get(self.sectors_url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        for _ in range(0, 4):
            SectorFactory.create(user=self.user_saved)

        response = self.client.get(self.sectors_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_create_sector(self):
        temp_data = factory.build(dict, FACTORY_CLASS=SectorFactory)
        print(temp_data)
        response = self.client.post(self.sectors_url, temp_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        created_instance = Sector.objects.get(id=response.data["id"])
        self.assertEqual(created_instance.user, self.user_saved)
        self.assertEqual(created_instance.super_sector, None)

    def test_create_sector_with_super_sector(self):
        super_sector = SuperSectorFactory.create(user=self.user_saved)
        temp_data = factory.build(
            dict,
            FACTORY_CLASS=SectorWithSuperSectorFactory,
            super_sector=super_sector.id,
        )
        response = self.client.post(self.sectors_url, temp_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        created_instance = Sector.objects.get(id=response.data["id"])
        self.assertEqual(created_instance.user, self.user_saved)
        self.assertEqual(created_instance.super_sector, super_sector)

    def test_create_super_sector(self):
        temp_data = factory.build(dict, FACTORY_CLASS=SuperSectorFactory)
        response = self.client.post(self.super_sectors_url, temp_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        created_instance = SuperSector.objects.get(id=response.data["id"])
        self.assertEqual(created_instance.user, self.user_saved)


class SectorsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = SectorFactory.create(user=cls.user_saved)
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_sector(self):
        url = reverse("sector-detail", args=[1])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[0].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[0].color,
        )
        url = reverse("sector-detail", args=[4])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[len(self.instances) - 1].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[len(self.instances) - 1].color,
        )

    def test_update_sector_super_sector(self):
        super_sector = SuperSectorFactory.create(user=self.user_saved)
        temp_data = factory.build(dict, FACTORY_CLASS=SectorFactory, super_sector=super_sector.id)
        url = reverse("sector-detail", args=[1])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )
        updated_instance = Sector.objects.get(id=response.data["id"])
        self.assertEqual(updated_instance.user, self.user_saved)
        self.assertEqual(updated_instance.super_sector, super_sector)

    def test_update_sector(self):
        temp_data = factory.build(dict, FACTORY_CLASS=SectorFactory)
        url = reverse("sector-detail", args=[1])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )

    def test_delete_sector(self):
        url = reverse("sector-detail", args=[1])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Sector.DoesNotExist):
            Sector.objects.get(id=1)


class SuperSectorsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = SuperSectorFactory.create(user=cls.user_saved)
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_super_sector(self):
        # for sector in SuperSector.objects.all():
        #   print(f"{sector.id} - {sector.name}")
        self.assertEqual(len(SuperSector.objects.all()), 4)
        url = reverse("super-sector-detail", args=[4])
        response = self.client.get(url)
        # # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[0].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[0].color,
        )
        url = reverse("super-sector-detail", args=[7])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[len(self.instances) - 1].name,
        )
        self.assertEqual(
            response.data["color"],
            self.instances[len(self.instances) - 1].color,
        )

    def test_update_super_sector(self):
        temp_data = factory.build(dict, FACTORY_CLASS=SuperSectorFactory)
        url = reverse("super-sector-detail", args=[4])
        response = self.client.put(url, temp_data)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            temp_data["name"],
        )
        self.assertEqual(
            response.data["color"],
            temp_data["color"],
        )

    def test_delete_super_sector(self):
        url = reverse("super-sector-detail", args=[4])
        response = self.client.delete(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(SuperSector.DoesNotExist):
            SuperSector.objects.get(id=4)