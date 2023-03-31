from django.shortcuts import render
from home.models import Exercise

# Create your views here.

def aboutExercise(request,id):
    exercise = Exercise.objects.get(pk=id)
    context = {
        'exercise':exercise
    }
    return render(request,'exercises/aboutExercise.html',context)