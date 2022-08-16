from django.urls import path
from markets.views import admin

urlpatterns = [
    path("create-markets/", admin.create_markets, name="create-markets"),
]
