from django.shortcuts import render
from django.http import JsonResponse,Http404

from django.db.models import Sum
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
        'page':'exercise'
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


@login_required(login_url='login')
def createCustomeExercise(request):
    user = request.user
    if request.method == 'POST':
        name = request.POST['name']
        category = request.POST['category']
        body_part = request.POST['body-part']

        if name and category and body_part:
            try:
               Exercise.objects.create(name=name,user =user,category=category,body_part=body_part,is_custom = True)
            except Exception as e:
               return JsonResponse(get_response_dict('error','couldnt create new exercise')) 
            
            return JsonResponse(get_response_dict('success','data saved successfully'))
        else:
            return JsonResponse(get_response_dict('error','fill all the fields'))

    return JsonResponse(get_response_dict('error','some thing went wrong'))
def presonal_records(request):
    max_volume_workout = (
    WorkoutSession.objects
        .filter(exercise__id=1)
    .annotate(total_volume=Sum('workoutsessionexercise__set__weight' * 'workoutsessionexercise__set__reps'))
    .order_by('-total_volume')
    .first()
    )