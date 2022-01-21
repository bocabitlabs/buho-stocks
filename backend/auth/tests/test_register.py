from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from auth.tests.factory import UserFactory
from faker import Faker


class UserSignUpTestCase(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user_object = UserFactory.build()
        cls.user_saved = UserFactory.create()
        cls.signup_url = reverse('auth_register')
        cls.faker_obj = Faker()

    def test_if_data_is_correct_then_signup(self):
        # Prepare data
        signup_dict = {
            'username': self.user_object.username,
            'password': 'test_Pass',
            'password2': 'test_Pass',
            'email': self.user_object.email,
            'first_name': self.user_object.first_name,
            'last_name': self.user_object.last_name,
        }
        # Make request
        response = self.client.post(self.signup_url, signup_dict)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        # Check database
        new_user = User.objects.get(username=self.user_object.username)
        self.assertEqual(
            new_user.first_name,
            self.user_object.first_name,
        )
        self.assertEqual(
            new_user.email,
            self.user_object.email,
        )

    def test_if_username_already_exists_dont_signup(self):
        # Prepare data with already saved user
        signup_dict = {
            'username': self.user_saved.username,
            'password': 'test_Pass',
            'password2': 'test_Pass',
            'email': self.user_saved.email,
            'first_name': self.user_saved.first_name,
            'last_name': self.user_saved.last_name,
        }
        # Make request
        response = self.client.post(self.signup_url, signup_dict)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            str(response.data['username'][0]),
            'A user with that username already exists.',
        )
        # Check database
        # Check that there is only one user with the saved username
        username_query = User.objects.filter(username=self.user_saved.username)
        self.assertEqual(username_query.count(), 1)


    def test_if_email_already_exists_dont_signup(self):
        # Prepare data with already saved user
        signup_dict = {
            'username': self.user_object.username,
            'password': 'test_Pass',
            'password2': 'test_Pass',
            'email': self.user_saved.email,
            'first_name': self.user_object.first_name,
            'last_name': self.user_object.last_name,
        }
        # Make request
        response = self.client.post(self.signup_url, signup_dict)
        # Check status response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            str(response.data['email'][0]),
            'This field must be unique.',
        )
        # Check database
        # Check that there is only one user with the saved username
        username_query = User.objects.filter(username=self.user_saved.username)
        self.assertEqual(username_query.count(), 1)