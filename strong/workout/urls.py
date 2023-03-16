from django.urls import path
from . import views
urlpatterns = [
    path("new-template",views.newTemplate, name="new-template"),
    path("show-all-exercises",views.showAllExercises, name="show-all-exercises")
]