from django.urls import path
from . import views
urlpatterns = [
    path("new-template",views.newTemplate, name="new-template"),
    path("show-all-exercises",views.showAllExercises, name="show-all-exercises"),
    path("start-empty-workout",views.startEmptyWorkout, name="start-empty-workout"),
    path("add-workout-session-exercise",views.add_workout_session_exercise,name="add_workout_session_exercise")
]
