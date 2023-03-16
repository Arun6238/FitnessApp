from django.shortcuts import render
from home.models import WorkoutTemplate,WorkoutExercise,Exercise
from django.http import JsonResponse
import json
# Create your views here.
def newTemplate(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        # do something with the data
        print(data)
        response_data = {'message': 'Data received successfully.'}
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