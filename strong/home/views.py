from django.shortcuts import render
from django.http import HttpResponse
from .models import *

# Create your views here.
def home(request):
    # addWorkout()
    exercise  = Exercise.objects.all()
    context= {'exercises':exercise}
    return render(request,"home/home.html",context)

def exercisePage(request):
    exercises = Exercise.objects.all()
    context = {
        'exercises':exercises
    }
    return render(request,'home/exercises.html',context)


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

def addWorkout(request):
    try:
        context={
        "myTemplates" :WorkoutTemplate.objects.filter(user= request.user).order_by('-id'),
    }
    except:
        print("error")

    return render(request,'home/addWorkout.html',context)

def userProfile(request):
    context = {}
    return render(request,'home/profile.html',context)

def history(request):
    try:
        user = request.user
        workout_sessions = WorkoutSession.objects.select_related('workoutsessionexercise').filter(user=user, finished=True)

        print(workout_sessions)
    except Exception as e:
        print(e)
    context = {}
    return render(request,'home/history.html',context)