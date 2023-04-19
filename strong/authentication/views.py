from django.shortcuts import render,redirect
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required

def anonymous_required(view_function, redirect_to=None):
    """
    Decorator for views that checks that the user is NOT logged in,
    redirecting to the redirect_to page if necessary.
    """
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            if redirect_to is not None:
                return redirect(redirect_to)
            else:
                return redirect('profile')
        else:
            return view_function(request, *args, **kwargs)
    return wrapped_view


# Create your views here.

@anonymous_required
def loginPage(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = authenticate(request,username = username,password=password)
            if user is not None:
                login(request,user)
                return redirect('profile')
            else:
                raise ValueError('Invalid username or password')
        except (ValueError, PermissionDenied) as e:
            return render(request,'authentication/login.html',{'error':str(e)})
            
    return render(request,'authentication/login.html')

@anonymous_required
def registerUser(request):
    if request.method == 'POST':
        name = request.POST['name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(username = username).exists():
            context = {"error":"Username already exists"}
            return render(request,'authentication/register.html',context)

        if User.objects.filter(email = email).exists():
            context = {"error":"Email address already exists."}
            return render(request,'authentication/register.html',context)            

        user = user = User.objects.create_user(username, email, password)
        user.first_name = name
        user.save()
        return redirect('login')
    return render(request,'authentication/register.html')

@login_required(login_url='login')
def logoutUser(request):
    logout(request)
    response = redirect('login')
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    
    return response
