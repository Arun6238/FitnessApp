
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('home.urls')),
    path('auth',include('authentication.urls')),
    path('measure/',include('measure.urls')),
    path('exercises/',include('exercises.urls')),
    path('workout/',include('workout.urls'))
]
