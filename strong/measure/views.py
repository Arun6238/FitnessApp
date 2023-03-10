from django.shortcuts import render,redirect
from django.http import HttpResponse,HttpResponseNotFound,HttpResponseBadRequest,HttpResponseServerError
from home.models import BodyMeasurement,MeasurementType
import datetime
import json

# Create your views here.

def showMeasures(request,measurementName):
    try:
        measureType = MeasurementType.objects.get(name = measurementName)
    except MeasurementType.DoesNotExist:
        return HttpResponseNotFound("Measurement type not found")
    if request.method == 'POST':
        try:
            date = request.POST['date']
            value = request.POST['value']

            measurement = BodyMeasurement()
            measurement.user = request.user
            measurement.date = date
            measurement.measurement_type = measureType
            measurement.value = value

            measurement.save()
        except (KeyError, ValueError):
            return HttpResponseBadRequest("Invalid or missing data")

    try:   
        measurements = BodyMeasurement.objects.filter(user = request.user, measurement_type = measureType).order_by('-date')
    except:
        return HttpResponseServerError("Error retreving mesasurements")
    
    labels = []
    data = []
    for i in measurements:
        labels.append(i.date.strftime("%B"+"."+"%d"+","+"%Y"))
        data.append(float(i.value))
    context = {
        'measurementName':measurementName,
        'measurements':measurements,
        "unit":measureType.unit,
        "measureType":measureType,
        "labels":json.dumps(labels),
        "data":json.dumps(data)
    }
    return render(request,'measure/measure.html',context)