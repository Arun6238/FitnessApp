from django.shortcuts import render,redirect
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.models import User

# Create your views here.

def loginPage(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request,username = username,password=password)
        if user is not None:
            login(request,user)
            return redirect('profile')

        else:
            return render(request,'authentication/login.html',{'error':'Invalid username or password.'})
            
    return render(request,'authentication/login.html')

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

def logoutUser(request):
    logout(request)
    return redirect('home')