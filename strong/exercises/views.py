from django.shortcuts import render
from django.http import JsonResponse,Http404

from home.models import Exercise,Set,WorkoutSession
from workout.views import get_response_dict
from django.contrib.auth.decorators import login_required



# Create your views here.
@login_required(login_url='login')
def aboutExercise(request,id):
    exercise = Exercise.objects.get(pk=id)
    # Get the logged-in user
    context = {
        'exercise':exercise,
    }
    return render(request,'exercises/aboutExercise.html',context)


@login_required(login_url='login')
def exercise_history(request, id):
    try:
        user = request.user

        # Use a single query to retrieve the necessary data

        if not WorkoutSession.objects.filter(user=user, workoutsessionexercise__exercise__id=id).exists():
            return JsonResponse(get_response_dict('warning','Not performed yet'))

        exercise_session = WorkoutSession.objects.filter(user=user, workoutsessionexercise__exercise__id=id).values('name', 'started_at', 'workoutsessionexercise__id')
        exercise_session = list(exercise_session)

        # add sets to each exercise session
        for i in exercise_session:
            sets = Set.objects.filter(exercise_session=i['workoutsessionexercise__id']).values('set_number', 'weight', 'reps')
            i['sets'] = list(sets)

        return JsonResponse(get_response_dict('success','success',exercise_session))  # return the serialized data in a JsonResponse

    except Exception as e:
        # Handle the error appropriately, e.g. log it, return an error response, etc.
        print(f"Error occurred: {e}")
        raise Http404("Exercise history not found")

