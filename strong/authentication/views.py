from django.shortcuts import render,redirect
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


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

@never_cache
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
            response = render(request,'authentication/login.html',{'error':str(e)})
            response['Pragma'] = 'no-cache'
            return response
            
    response = render(request, 'authentication/login.html')
    response['Pragma'] = 'no-cache'
    return response

@never_cache
@anonymous_required
def registerUser(request):
    if request.method == 'POST':
        name = request.POST['name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(username = username).exists():
            context = {"error":"Username already exists"}
            response = render(request,'authentication/register.html',context)
            response['Pragma'] = 'no-cache'
            return response

        if User.objects.filter(email = email).exists():
            context = {"error":"Email address already exists."}
            response = render(request,'authentication/register.html',context)
            response['Pragma'] = 'no-cache'
            return response          

        user = user = User.objects.create_user(username, email, password)
        user.first_name = name
        user.save()
        return redirect('login')
    response = render(request,'authentication/register.html')
    response['Pragma'] = 'no-cache'
    return response

@login_required(login_url='login')
def logoutUser(request):
    logout(request)
    response = redirect('login')
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    
    return response
