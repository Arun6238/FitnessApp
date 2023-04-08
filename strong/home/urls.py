from django.urls import path
from . import views

urlpatterns = [
    path('',views.userProfile,name="profile"),
    path('exercises/',views.exercisePage,name="exercises"),
    path('measures',views.measures,name="measures"),
    path('workouts',views.addWorkout,name="workouts"),
    path('history',views.history,name="history"),
    path('workout-history',views.workout_history,name="workout-history"),
]
