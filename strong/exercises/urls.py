from django.urls import path
from .import views
urlpatterns = [
    path('about-exercise/<str:id>',views.aboutExercise,name="about-exercise"),
    path('exercise-history/<str:id>',views.exercise_history,name='exercise-history'),

]
