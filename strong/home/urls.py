from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name="home"),
    path('exercises/',views.exercisePage,name="exercises"),
    path('about-exercise/<str:id>',views.aboutExercise,name="about-exercise"),
    path('measures',views.measures,name="measures"),
    path('add-workout',views.addWorkout,name="add-workout"),
    path('profile',views.userProfile,name="profile"),
    path('history',views.history,name="history"),
]
