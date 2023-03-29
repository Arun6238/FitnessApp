from django.shortcuts import render,redirect
from home.models import WorkoutTemplate,WorkoutExercise,Exercise,WorkoutSession,WorkoutSessionExercise,Set
from django.db.models import Q
from django.db import transaction
from django.http import JsonResponse, HttpResponseBadRequest
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

# function to generate standard response format
def get_response_dict(status,message):
    return {
        'status':status,
        'message':message
    }

# creates a new workout template
@transaction.atomic()
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
            return JsonResponse(get_response_dict('error','Error occured during new template creation'))
        for key in data['selected-exercise']:
            # get Exercise object using  post data
            try:
                exerciseId = data['selected-exercise'][key]['id']
                exercise = Exercise.objects.get(pk =exerciseId )
            except Exception as e:
                return JsonResponse(get_response_dict('error','Error occured during new template creation'))
            set = data['selected-exercise'][key]['set']
            # create a Workout exercise object
            try:
                WorkoutExercise.objects.create(
                workout_template= workoutTemplate,
                exercise= exercise,
                sets =set)
            except Exception as e:
                return JsonResponse(get_response_dict('error','Error occured during new template creation'))

        return JsonResponse(get_response_dict('success','New template created succeffully..'))
    # if request.method not post renders the page to create new workout template
    return render(request,"workout/createTemplate.html")

# returns a list of all exercise in Exercise model
def showAllExercises(request):
    data = {}
    exercises  = Exercise.objects.all().values()
    data['exercises'] = list(exercises)
    return JsonResponse(data)

# view funciton for starting empty workout
# needs some modifications....
def startEmptyWorkout(request):
    try:
        if WorkoutSession.objects.filter(user= request.user,finished= False).exists():
            w = WorkoutSession.objects.filter(user= request.user,finished = False)[0]
            print(w.name)
            for i in w.workoutsessionexercise_set.all():
                print(i)
                for j in i.set_set.all():
                    print(j)
        else:
            w =  WorkoutSession.objects.create(user= request.user,name="new workout",finished=False)
    except:
        print("some thinf went wrong...")
    start_time = w.started_at.isoformat()
    context = {"start_time":start_time,"WorkoutSession":w}
    return render(request,'workout/startEmpty.html',context)

@require_POST
@transaction.atomic()
def add_workout_session_exercise(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)
        workout_session = get_object_or_404(WorkoutSession, id=data['workoutSessionId'])
        user = request.user

        if not user.is_authenticated:
            return JsonResponse(get_response_dict('error', "User not authenticated"))

        exercises_added = []
        for exercise_id in data['exercises']:
            exercise = get_object_or_404(Exercise, id=exercise_id)
            if not WorkoutSessionExercise.objects.filter(workout_session=workout_session, exercise=exercise).exists():
                try:
                    exercise_session = WorkoutSessionExercise.objects.create(workout_session=workout_session, exercise=exercise)
                    Set.objects.create(exercise_session=exercise_session, set_number=1)
                    exercises_added.append(exercise.name)
                except Exception as e:
                    return JsonResponse(get_response_dict('error', f"Failed to add exercise '{exercise.name}'"))

        if not exercises_added:
            return JsonResponse(get_response_dict('error', "No new exercises selected"))
        else:
            return JsonResponse({"status": "success", "exercises_added": exercises_added})

    except Exception as e:
        return JsonResponse(get_response_dict('error', f"An error occured : {e}"))


@require_POST
@transaction.atomic()
def save_workout_session_exercise_Set(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)

        # checks if the weight and reps data are valid
        if not(float(data['weight'])>0 and int(data['reps'])>0):
            raise Exception('Inputs a must be a positive number')
    except Exception as e:
        return JsonResponse(get_response_dict('error', str(e.args[0])))
    
    try:
        # retrive the WorkoutSessionExercise objects using POST data
        workout_session_exercise = WorkoutSessionExercise.objects.get(pk = data["exercise_session"])
    except Exception as e:
        return JsonResponse(get_response_dict('error',f'An errror occured: {e}'))
    # variable to store  set number
    set_no = int(data['set_number']) 
    try:
        # checks if the given set is already in database
        if Set.objects.filter(set_number = set_no,exercise_session = workout_session_exercise).exists():
            new_set = Set.objects.get(set_number = set_no,exercise_session = workout_session_exercise) 
            # if both are valid data update the database with new value
            new_set.weight = data['weight']
            new_set.reps = data['reps']
            new_set.save()
            # checks if previous set is saved in data base
        elif (Set.objects.filter(set_number = set_no-1,exercise_session = workout_session_exercise).exists()):
            new_set = Set.objects.create(
                exercise_session= workout_session_exercise,
                set_number= set_no,
                weight= data['weight'],
                reps = data['reps']
            )
        return JsonResponse(get_response_dict('success',f'Set-{set_no} saved successfully'))
    except Exception as e:
            return JsonResponse(get_response_dict('error',f'An errror occured: {e}'))


# {exercise_session : 9
# set_number : 1
# weight : 10
# reps : 15}
@require_POST
def add_workout_session_exercise_new_set(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)
        for i in data:
            print(f"{i} : {data[i]}")
    except Exception as e:
        print(f"an error occured: {e} ")

    return JsonResponse({
        "status":"success"
    })

@require_POST
def finish_workout_session(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)
    except Exception as e:
        return JsonResponse(get_response_dict('error','could not save wokrout..'))
    
    try:
        workout_session = WorkoutSession.objects.get(pk = data['workout_session_id'])
        workout_session.finished = True
        workout_session.save()
    except:
        return JsonResponse(get_response_dict('error','could not save wokrout..'))
    
    return JsonResponse(get_response_dict('success','Workout saved successFully'))

def cancel_workout(request,id):
    try:
        workout_session = WorkoutSession.objects.get(pk =id)
        workout_session.delete()
    except:
        print("could not cancel the workout")

    return redirect('workouts')
