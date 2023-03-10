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

def aboutExercise(request,id):
    exercise = Exercise.objects.get(pk=id)
    context = {
        'exercise':exercise
    }
    return render(request,'home/aboutExercise.html',context)

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
    context={

    }

    return render(request,'home/addWorkout.html',context)
def userProfile(request):
    context = {}
    return render(request,'home/profile.html',context)

def history(request):
    context = {}
    return render(request,'home/history.html',context)