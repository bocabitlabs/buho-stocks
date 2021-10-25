from django.urls import path
from sectors import views

urlpatterns = [
    path("",views.SectorListAPIView.as_view()),
    path("<int:sector_id>/",views.SectorDetailAPIView.as_view()),
    path("super/",views.SuperSectorListAPIView.as_view()),
    path("super/<int:sector_id>/",views.SuperSectorDetailAPIView.as_view()),
]