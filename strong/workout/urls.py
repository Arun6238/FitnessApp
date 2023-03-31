from django.urls import path
from . import views
urlpatterns = [
    path("new-template",views.newTemplate, name="new-template"),
    path('delete-template/<str:id>',views.delete_template,name="delete-template"),
    path("show-all-exercises",views.showAllExercises, name="show-all-exercises"),
    path("start-empty-workout",views.startEmptyWorkout, name="start-empty-workout"),
    path("add-workout-session-exercise",views.add_workout_session_exercise,name="add_workout_session_exercise"),
    path('save_workout_session_exercise_Set',views.save_workout_session_exercise_Set,name="save_workout_session_exercise_Set"),
    path('finish-workout-session',views.finish_workout_session,name="finish-workout-session"),
    path('cancel-workout/<str:id>',views.cancel_workout,name="cancel-workout"),
    path('select-template-as-workout/<str:id>',views.select_template_as_workout,name="select-template-as-workout"),
    path('delete-template/<str:id>',views.delete_template,name="delete-template"),
    path('rename-template/<str:id>/<str:name>',views.rename_template,name="rename-template")
]
