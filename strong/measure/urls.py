from django.urls import path
from . import views

urlpatterns = [
    path("show-measures/<str:measurementName>",views.showMeasures,name="show-measures")
]
