from django.urls import path
from sectors.views import admin

urlpatterns = [
    path("create-sectors/", admin.create_sectors, name="create-sectors"),
]
