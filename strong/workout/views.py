from django.shortcuts import render,redirect
from home.models import WorkoutTemplate,WorkoutExercise,Exercise,WorkoutSession,WorkoutSessionExercise,Set
from django.db import transaction
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required

import datetime


# function to generate standard response format
def get_response_dict(status,message,data=None):
    return {
        'status':status,
        'message':message,
        'data':data
    }
# Funcition to check wether a workout session is live 
@login_required(login_url='login')
def is_workout_session_in_progress(request):
    if WorkoutSession.objects.filter(user= request.user,finished= False).exists():
        return True
    else:
        return False

# creates a new workout template
@login_required(login_url='login')
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
@login_required(login_url='login')
def showAllExercises(request):
    data = {}
    exercises  = Exercise.objects.all().values()
    data['exercises'] = list(exercises)
    return JsonResponse(data)


@login_required(login_url='login')
def check_for_live_workout_session(request):
    if WorkoutSession.objects.filter(user= request.user,finished= False).exists():
        workout_session = WorkoutSession.objects.filter(user= request.user,finished = False)[0]

        context = {
                    'workout_session_name':workout_session.name,
                    'time':workout_session.started_at
                    }
        
        return JsonResponse(get_response_dict('success','workout session in progress',context))
    return JsonResponse(get_response_dict('failed','No workout session in progress'))
# view funciton for starting empty workout
# needs some modifications....
@login_required(login_url='login')
def startEmptyWorkout(request):
    try:
        # check if there i a workout session already in progress
        if WorkoutSession.objects.filter(user= request.user,finished= False).exists():
            w = WorkoutSession.objects.filter(user= request.user,finished = False)[0]
        else:
            # save the current time in current_time variable
            current_time = datetime.datetime.now().time()
            # give the workout a name using current time
            if current_time < datetime.time(7):
                workout_name = "Early Morning Workout"
            elif current_time < datetime.time(12):
                workout_name = "Morning Workout"
            elif current_time < datetime.time(15):
                workout_name = "Afternoon Workout"
            elif current_time <datetime.time(18):
                workout_name = "Evening Workout"
            else:
                workout_name = "Night Workout"

            w =  WorkoutSession.objects.create(user= request.user,name=workout_name,finished=False)
    except:
        print("some thinf went wrong...")
    start_time = w.started_at.isoformat()
    context = {"start_time":start_time,"WorkoutSession":w,"page":'start_empty_workout'}
    return render(request,'workout/startEmpty.html',context)

#  funtion to rename workout session
@login_required(login_url='login')
def rename_empty_workout(request):
    workout_session_id = request.GET.get('id')
    newName = request.GET.get('name')

    try:
        workout_session = WorkoutSession.objects.get(id = workout_session_id)

        if(workout_session.name != newName):
            workout_session.name = newName
            workout_session.save()

    except Exception as e:
        print(f'error occured : {e}')
        return JsonResponse(get_response_dict('error','rename failed'))
    return JsonResponse(get_response_dict('success','renamed succesfully'))

@login_required(login_url='login')
@require_POST
@transaction.atomic()
def add_workout_session_exercise(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)
        workout_session = get_object_or_404(WorkoutSession, id=data['workoutSessionId'])
        user = request.user

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

@login_required(login_url='login')
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
        #  check if set it is the first set
            if set_no>1:
                previous_set  = Set.objects.get(set_number = set_no-1,exercise_session = workout_session_exercise)
                print(f"weight :{previous_set.weight}")
                print(f"weight :{previous_set.reps}")
                if (previous_set.weight == None or previous_set.weight == 0 ) and (previous_set.reps == None or previous_set.reps == 0):
                    return JsonResponse(get_response_dict('warning','Please save the previous set'))
            new_set = Set.objects.get(set_number = set_no,exercise_session = workout_session_exercise) 
            # if both are valid data update the database with new value
            new_set.weight = data['weight']
            new_set.reps = data['reps']
            new_set.save()
            # checks if previous set is saved in data base
        elif (Set.objects.filter(set_number = set_no-1,exercise_session = workout_session_exercise).exists()):
            previous_set  = Set.objects.get(set_number = set_no-1,exercise_session = workout_session_exercise)
            print(f"weight :{previous_set.weight}")
            print(f"weight :{previous_set.reps}")
            if (previous_set.weight == None or previous_set.weight == 0 ) and (previous_set.reps == None or previous_set.reps == 0):
                return JsonResponse(get_response_dict('warning','Please save the previous set'))
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

# this funcion is not used anywhere
@login_required(login_url='login')
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

@login_required(login_url='login')
@require_POST
def finish_workout_session(request):
    try:
        body = request.body.decode('utf-8')
        data = json.loads(body)
    except Exception as e:
        return JsonResponse(get_response_dict('error','could not save wokrout..'))
    
    try:
        workout_session = WorkoutSession.objects.get(pk = data['workout_session_id'])

        finished_set = 0
        unfinished_sets = []
        unfinished_exercise =[]
        for exercise in workout_session.workoutsessionexercise_set.all():
            sets = exercise.set_set.all().order_by('set_number')
            for set in sets:
                # check if each sets are empy or not
                if not isinstance(set.weight,(int,float)) or not isinstance(set.reps,(int,)):
                    # if first set is empty that means all the other sets are empty.So add the exercise to unfinished_exercise
                    if set.set_number == 1:
                        unfinished_exercise.append(set.exercise_session)
                        break
                    # save all the unfinished sets objects in unfinished set arrray
                    unfinished_sets.append(set)
                finished_set +=1

        if finished_set <1:
            return JsonResponse(get_response_dict('warning','you havent finished any set'))
        
        # delete all the unfinished exercise
        for exercise in unfinished_exercise:
            exercise.delete()
        # delete all the unfinished sets
        for set in unfinished_sets:
            set.delete()

        workout_session.finished = True
        workout_session.save()
    except Exception as e:
        return JsonResponse(get_response_dict('error','could not save wokrout..'))
    
    return JsonResponse(get_response_dict('success','Workout saved successFully'))

@login_required(login_url='login')
def cancel_workout(request,id):
    try:
        workout_session = WorkoutSession.objects.get(pk =id)
        workout_session.delete()
    except:
        print("could not cancel the workout")
        return JsonResponse(get_response_dict('error','could not cancel the workout'))

    return redirect('workouts')

@login_required(login_url='login')
@transaction.atomic()
def select_template_as_workout(request,id):
    if is_workout_session_in_progress(request):
        id = WorkoutSession.objects.get(user= request.user,finished= False).id
        return JsonResponse(get_response_dict('warning','A workout session is already in progress',{"id":id}))
    else:
        try:
            template = WorkoutTemplate.objects.get(pk= id)
            template_exercise = WorkoutExercise.objects.filter( 
                workout_template =template
            )
        except Exception as e:
            return JsonResponse(get_response_dict('error','template not found..'))
        try:
            workout_session = WorkoutSession.objects.create(
                user= template.user,
                name= template.name,
                finished= False
            )
            for exercise in template_exercise:
                workout_session_exercise= WorkoutSessionExercise()
                workout_session_exercise.workout_session= workout_session
                workout_session_exercise.exercise= exercise.exercise
                
                workout_session_exercise.save()
                
                for i in range(int(exercise.sets)):
                    set = Set()
                    set.exercise_session= workout_session_exercise
                    set.set_number = i+1
                    set.save()

        except Exception as e:
            print(e)
            return JsonResponse(get_response_dict('error','could not create a workout session'))
    return JsonResponse(get_response_dict('success','workout session created successfully..'))

@login_required(login_url='login')
def delete_template(request,id):
    try:
        template = WorkoutTemplate.objects.get(pk =id)
        template.delete()
    except ObjectDoesNotExist:
        return JsonResponse(get_response_dict('warning','Template not found'))
    except Exception as e:
        return JsonResponse(get_response_dict('error',f'some error occured : {e}'))
    
    return JsonResponse(get_response_dict('success','Template removed successfully'))

@login_required(login_url='login')
def rename_template(request,id,name):
    try:
        template = WorkoutTemplate.objects.get(pk =id)

        if template.name == name:
            return JsonResponse(get_response_dict('warning','Template rename was not performed because the new name is the same as the old name.'))
        else:
            template.name = name;
            template.save()

            return JsonResponse(get_response_dict('success','successfully update the name'))
    except ObjectDoesNotExist:
            return JsonResponse(get_response_dict('warning','Template not found'))
    except Exception as e:
                return JsonResponse(get_response_dict('error',f'some error occured {e}'))
    
