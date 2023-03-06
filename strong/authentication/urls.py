from django.urls import path
from . import views

urlpatterns = [
    path('',views.loginPage,name='login'),
    path('register',views.registerUser,name='register'),
    path('logout',views.logoutUser,name='logout'),
]

