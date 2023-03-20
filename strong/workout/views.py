from django.shortcuts import render,redirect
from home.models import WorkoutTemplate,WorkoutExercise,Exercise
from django.http import JsonResponse
import json
# Create your views here.
def newTemplate(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)

        user = request.user
        name = data['template-name']
        try:
            workoutTemplate = WorkoutTemplate.objects.create(user= user,name= name)
        except Exception as e:
            print(f"Error creating WorkoutTemplate object: {e}")
        for key in data['selected-exercise']:

            # get Exercise object using  post data
            try:
                exerciseId = data['selected-exercise'][key]['id']
                exercise = Exercise.objects.get(pk =exerciseId )
            except Exception as e:
                print(f"Error getting exercise object:{e}")
            set = data['selected-exercise'][key]['set']

            # create a Workout exercise object
            try:
                WorkoutExercise.objects.create(
                workout_template= workoutTemplate,
                exercise= exercise,
                sets =set)
            except Exception as e:
                print(f"Error occured while creating WorkoutExrecise object : {e}")

        response_data = {
            'status': 'success',
            'message': 'Object saved successfully',
        }
        return JsonResponse(response_data)
    context = {
        "exercises":Exercise.objects.all()
    }

    return render(request,"workout/createTemplate.html",context)

def showAllExercises(request):
    data = {}
    exercises  = Exercise.objects.all().values()
    data['exercises'] = list(exercises)
    return JsonResponse(data)

def saveNewTemplate(request):
    pass