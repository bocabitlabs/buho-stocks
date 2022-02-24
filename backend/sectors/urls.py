from django.urls import path
from sectors import views

urlpatterns = [
    path("",views.SectorListCreateAPIView.as_view(), name="sector-list"),
    path("<int:sector_id>/",views.SectorDetailAPIView.as_view(), name="sector-detail"),
    path("super/",views.SuperSectorListCreateAPIView.as_view(), name="super-sector-list"),
    path("super/<int:sector_id>/",views.SuperSectorDetailAPIView.as_view(), name="super-sector-detail"),
]