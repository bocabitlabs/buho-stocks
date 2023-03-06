import logging

from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase
from sectors.tests.factory import SectorFactory

logger = logging.getLogger("buho_backend")


class SectorsListTestCase(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.sectors_url = reverse("sector-list")
        cls.super_sectors_url = reverse("super-sector-list")
        cls.faker_obj = Faker()

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
        instances = []
        for _ in range(0, 4):
            instance = SectorFactory.create()
            instances.append(instance)
        cls.instances = instances

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
