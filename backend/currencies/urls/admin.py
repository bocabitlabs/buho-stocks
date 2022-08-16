from django.urls import path
from currencies.views import admin

urlpatterns = [
    path("create-currencies/", admin.create_currencies, name="create-currencies"),
]
