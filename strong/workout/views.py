from django.shortcuts import render,redirect
from home.models import WorkoutTemplate,WorkoutExercise,Exercise,WorkoutSession,WorkoutSessionExercise,Set
from django.db.models import Q
from django.http import JsonResponse
import json
from django.utils import timezone



def newTemplate(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)

        user = request.user
        name = data['template-name']
        try:
            # creates new WorkoutTemplate object
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

    return render(request,"workout/createTemplate.html")

def showAllExercises(request):
    data = {}
    exercises  = Exercise.objects.all().values()
    data['exercises'] = list(exercises)
    return JsonResponse(data)

# view funciton for starting empty workout
def startEmptyWorkout(request):
    if WorkoutSession.objects.filter(user= request.user,finished= False).exists():
        w = WorkoutSession.objects.get(finished = False)
        print(w.name)
        for i in w.workoutsessionexercise_set.all():
            print(i)
            for j in i.set_set.all():
                print(j)

        start_time = w.started_at.isoformat()
    context = {"start_time":start_time,"WorkoutSession":w}
    return render(request,'workout/startEmpty.html',context)

def add_workout_session_exercise(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    user = request.user

    try:
        workout_session = WorkoutSession.objects.get(id=data['workoutSessionId'])
    except Exception as e:
        print(f"an error occured : {e}")

    for i in data['exercises']:
        exercise = Exercise.objects.get(id = i)
        if WorkoutSessionExercise.objects.filter(workout_session=workout_session,exercise=exercise).exists():
           continue
        else:
            try:
                exercise_session = WorkoutSessionExercise.objects.create(workout_session= workout_session,exercise= exercise)
            except Exception as e:
                print(f"error occured {e}")
        try:
            Set.objects.create(exercise_session =exercise_session,set_number =1)
        except Exception as e:
            print(f"error occured : {e}")
        
    print("workoutSessionId :",data['workoutSessionId'])
    return JsonResponse({
        "status":"success"
    })
