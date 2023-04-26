from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from workout.views import get_response_dict 
from django.contrib.auth.decorators import login_required
from datetime import datetime

from django.db.models import Q

from django.core.paginator import Paginator ,EmptyPage, PageNotAnInteger

@login_required(login_url='login')
def exercisePage(request):
    user = request.user
    exercises = Exercise.objects.filter(Q(is_custom =False) | Q(is_custom=True,user =user)).order_by('name').values('id','name','body_part','image_url','is_custom')
    paginator = Paginator(exercises, 10) # Show 10 exercises per page

    if 'HTTP_ACCEPT' in request.META and 'application/json' in request.META['HTTP_ACCEPT']:
        page_number = request.GET.get('page')
        try:
            page_obj = paginator.page(page_number)
        except (PageNotAnInteger, EmptyPage):
            return JsonResponse(get_response_dict('error','Invalid page number', None))

        exercise_dict = list(page_obj)
        if not page_obj.has_next():
            data = {
                'has_next': False,
                'exercises':exercise_dict
            }
        else:
            data= {
                'has_next': True,
                'exercises':exercise_dict
                }
        
        return JsonResponse(get_response_dict('success','no message',data))
    page_number = 1
    page_obj = paginator.get_page(page_number)
    context = {'exercises': page_obj}

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
    user = request.user

    completed_workout_count = WorkoutSession.objects.filter(user=user,finished =True).count()
    recent_workout = WorkoutSession.objects.filter(user=user, finished =True).order_by('-started_at').first()
    context = {
        'count':completed_workout_count,
        'recent_workout':recent_workout
    }
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