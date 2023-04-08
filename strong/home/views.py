from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from workout.views import get_response_dict 
from django.contrib.auth.decorators import login_required
from datetime import datetime,  timezone
@login_required(login_url='login')
def exercisePage(request):
    exercises = Exercise.objects.all()
    context = {
        'exercises':exercises
    }
    return render(request,'home/exercises.html',context)

@login_required(login_url='login')
def measures(request):
    context = {
        'core':[
            "Weight",
            "Caloric intake",
            "Fat_percentage"
        ],
        'body_part':[
            "Neck",
            "Shoulders",
            "Chest",
            "Left bicep",
            "Right bicep",
            "Left forearm",
            "Right forearm",
            "Upper abs",
            "Waist",
            "Lower abs",
            "Hips",
            "Left thigh",
            "Right thigh",
            "Left calf",
            "Right calf"
        ]
    }
 
    return render(request,'home/measures.html',context)

@login_required(login_url='login')
def addWorkout(request):
    context={}
    try:
        context={
        "myTemplates" :WorkoutTemplate.objects.filter(user= request.user).order_by('-id'),
    }
    except:
        print("error")

    return render(request,'home/addWorkout.html',context)

@login_required(login_url='login')
def userProfile(request):
    context = {}
    return render(request,'home/profile.html',context)

# function to display history page
@login_required(login_url='login')
def history(request):

    return render(request,'home/history.html')

# funtion to send all the workout history of logined user
@login_required(login_url='login')
def workout_history(request):
        
        user = request.user

        data = []
        # query all the finished workout session of request.user

        try:
            date_str = request.GET.get('date_time')
            date_format = "%Y-%m-%d"
            date_time_obj = datetime.strptime(date_str,date_format)

            if not WorkoutSession.objects.filter(user=user,finished=True).exists():
                return JsonResponse(get_response_dict('warning','Not performed any workout yet'))

            Workout_session = WorkoutSession.objects.filter(
                user=user,
                # The date() method is used to extract the date part from the started_at field
                started_at__date__lte=date_time_obj,
                finished=True).order_by('-started_at')[:30]


            if  not Workout_session.exists():
                return JsonResponse(get_response_dict('no-data','No workout sessions performed before the selected date'))

            for session in Workout_session:
                session_data = {
                    'name':session.name,
                    'started_at':session.started_at,
                    'exercises':[]
                }
                # retrieve all the exercise in each session
                for exercise in session.workoutsessionexercise_set.all():
                    exercise_data = {
                        'exercise':exercise.exercise.name,
                        'sets':[]
                    }
                    # retrieves all the sets performed for an exercise
                    for set in exercise.set_set.all().order_by('set_number'):
                        set_data = {
                            'set_no':set.set_number,
                            'weight':set.weight,
                            'reps':set.reps
                        }

                        exercise_data['sets'].append(set_data)
                    
                    session_data['exercises'].append(exercise_data)
                data.append(session_data)
        except:
            return JsonResponse(get_response_dict('error','could not retrieve history'))
        
        return JsonResponse(get_response_dict('success','history successfully retrieved',data))