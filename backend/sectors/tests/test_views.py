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
            SectorFactory.create()

        response = self.client.get(self.sectors_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)


class SectorsDetailTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.user_saved = UserFactory.create()
        cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
        instances = []
        for _ in range(0, 4):
            instance = SectorFactory.create()
            instances.append(instance)
        cls.instances = instances

    def setUp(self):
        self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_get_sector(self):
        url = reverse("sector-detail", args=[self.instances[0].id])
        response = self.client.get(url)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.instances[0].name,
        )
        index = len(self.instances) - 1
        url = reverse("sector-detail", args=[self.instances[index].id])
        response = self.client.get(url)
        self.assertEqual(
            response.data["name"],
            self.instances[index].name,
        )


# class SuperSectorsDetailTestCase(APITestCase):
#     @classmethod
#     def setUpClass(cls) -> None:
#         super().setUpClass()
#         cls.user_saved = UserFactory.create()
#         cls.token, _ = Token.objects.get_or_create(user=cls.user_saved)
#         instances = []
#         for _ in range(0, 4):
#             instance = SuperSectorFactory.create()
#             instances.append(instance)
#         cls.instances = instances

#     def setUp(self):
#         self.client = APIClient(HTTP_AUTHORIZATION="Token " + self.token.key)

#     def test_get_super_sector(self):
#         index = 0
#         self.assertEqual(len(SuperSector.objects.all()), 4)
#         url = reverse("super-sector-detail", args=[self.instances[index].id])
#         response = self.client.get(url)
#         # # # Check status response
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             response.data["name"],
#             self.instances[index].name,
#         )
#         self.assertEqual(
#             response.data["color"],
#             self.instances[index].color,
#         )
#         index = len(self.instances) - 1
#         url = reverse("super-sector-detail", args=[self.instances[index].id])
#         response = self.client.get(url)
#         self.assertEqual(
#             response.data["name"],
#             self.instances[index].name,
#         )
#         self.assertEqual(
#             response.data["color"],
#             self.instances[index].color,
#         )

#     def test_update_super_sector(self):
#         index = 0
#         temp_data = factory.build(dict, FACTORY_CLASS=SuperSectorFactory)
#         url = reverse("super-sector-detail", args=[self.instances[index].id])
#         response = self.client.put(url, temp_data)
#         # Check status response
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             response.data["name"],
#             temp_data["name"],
#         )
#         self.assertEqual(
#             response.data["color"],
#             temp_data["color"],
#         )

#     def test_delete_super_sector(self):
#         index = len(self.instances) - 1
#         url = reverse("super-sector-detail", args=[self.instances[index].id])
#         response = self.client.delete(url)
#         # Check status response
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         with self.assertRaises(SuperSector.DoesNotExist):
#             SuperSector.objects.get(id=self.instances[index].id)
