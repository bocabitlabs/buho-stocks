from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from auth.tests.factory import UserFactory
from faker import Faker


class UserLoginTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user_object = UserFactory.build()
        # Prepare data
        cls.signup_dict = {
            "username": cls.user_object.username,
            "password": cls.user_object.password,
            "password2": cls.user_object.password,
            "email": cls.user_object.email,
            "first_name": cls.user_object.first_name,
            "last_name": cls.user_object.last_name,
        }

        user = User.objects.create(
            username=cls.signup_dict["username"],
            email=cls.signup_dict["email"],
            first_name=cls.signup_dict["first_name"],
            last_name=cls.signup_dict["last_name"],
        )

        user.set_password(cls.signup_dict["password"])
        user.save()

        cls.signup_url = reverse("auth_register")
        cls.login_url = reverse("auth_login")
        cls.faker_obj = Faker()

    def test_if_login_works(self):
        # Make request
        self.assertEqual(User.objects.count(), 1)
        data = {
            "username": self.user_object.username,
            "password": self.user_object.password,
        }
        response = self.client.post(
            self.login_url,
            data,
            format="json",
        )
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "token")


    def test_invalid_password(self):
        self.client.post(self.signup_url, self.signup_dict)
        # Make request
        self.assertEqual(User.objects.count(), 1)
        data = {
            "username": self.user_object.username,
            "password": "OH NO",
        }
        response = self.client.post(
            self.login_url,
            data,
            format="json",
        )
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
