from django.urls import path
from benchmarks.views import admin

urlpatterns = [
    path("create-benchmarks/", admin.create_benchmarks, name="create-benchmarks"),
]
