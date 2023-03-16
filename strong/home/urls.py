from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name="home"),
    path('exercises/',views.exercisePage,name="exercises"),
    path('measures',views.measures,name="measures"),
    path('workouts',views.addWorkout,name="workouts"),
    path('profile',views.userProfile,name="profile"),
    path('history',views.history,name="history"),
]
