from django.conf.urls import include
from django.urls import path
from rest_framework.authtoken import views
from auth.views import RegisterView


urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name="auth_login"),
    path('register/', RegisterView.as_view(), name='auth_register'),
]