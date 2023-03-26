from django.db import models
from django.contrib.auth.models import User

class MeasurementType(models.Model):
    CHOICES_NAME = [
        ("Weight","Weight"),
        ("Caloric intake","Caloric intake"),
        ("Fat_percentage","Fat_percentage"),

        ("Neck","Neck"),
        ("Shoulders","Shoulders"),
        ("Chest","Chest"),
        ("Left bicep","Left bicep"),
        ("Right bicep","Right bicep"),
        ("Left forearm","Left forearm"),
        ("Right forearm","Right forearm"),
        ("Upper abs","Upper abs"),
        ("Waist","Waist"),
        ("Lower abs","Lower abs"),
        ("Hips","Hips"),
        ("Left thigh","Left thigh"),
        ("Right thigh","Right thigh"),
        ("Left calf","Left calf"),
        ("Right calf","Right calf"),
    ]

    CHOICES_UNIT = [
        ("cm","cm"),
        ("kg","kg"),
        ("%","%"),
        ("kcal","kcal")
    ]

    name = models.CharField(max_length=50,choices=CHOICES_NAME)
    unit = models.CharField(max_length=10,choices =CHOICES_UNIT)

    def __str__(self):
        return f"{self.name} ({self.unit})"


class BodyMeasurement(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    date = models.DateField()
    measurement_type = models.ForeignKey(MeasurementType, on_delete = models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2)



class Exercise(models.Model):

    BODY_PART_CHOICES = [
        ("None",'None'),
        ("Core","Core"),
        ("Arms","Arms"),
        ("Back","Back"),
        ("Chest","Chest"),
        ("Legs","Legs"),
        ("Shoulders","Shoulders"),
        ("Other","Other"),
        ("Olympic","Olympic"),
        ("Full body","Full body"),
        ("Cardio","Cardio"),
    ]

    CATEGORY_CHOICES = [
        ("Barbell","Barbell"),
        ("Dumbbell","Dumbbell"),
        ("Machine/Other","Machine/Other"),
        ("Weighted bodyweight","Weighted bodyweight"),
        ("Assisted body","Assisted body"),
        ("Reps only","Reps only"),
        ("Cardio exercice","Cardio exercice"),
        ("Duration","Duration"),
    ]
    name = models.CharField(max_length=100,null=True,blank=True)
    body_part = models.CharField(max_length=100,choices= BODY_PART_CHOICES,null=True,blank=True)
    category = models.CharField(max_length=100,choices= CATEGORY_CHOICES,null=True,blank=True)
    image_url = models.URLField(null=True,blank=True)

    def __str__(self) :
        return self.name

# table to store instructions of each exercise
class ExerciseInstruction(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE,null=True,blank=True)
    step_number = models.IntegerField(null=True,blank=True)
    description = models.TextField(null=True,blank=True)

    def __str__(self):
        return self.exercise.name +"-"+ str(self.step_number)

# table to store wokrout-template(cantains template name and user to witch the template belongs)
class WorkoutTemplate(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE ,null = True, blank=True)
    name = models.CharField(max_length=255,null = True,blank=True)

    def __str__(self):
        return str(self.id) +"."+ self.name
    
# table to store each exercise and the Workout template that it belongs and the number sets each exercise has to be perform 
class WorkoutExercise(models.Model):
    workout_template = models.ForeignKey(WorkoutTemplate, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.workout_template.id}-{self.workout_template.name} ({self.id})"

    

class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=255,null=True,blank=True)
    started_at = models.DateTimeField()
    duration = models.CharField(max_length=200,blank=True,null=True)
    finished = models.BooleanField(default=False)


    def __str__(self):
        return self.name

class WorkoutSessionExercise(models.Model):
    workout_session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.workout_session.id} + {self.workout_session.name} + ({self.id})"

class Set(models.Model):
    exercise_session = models.ForeignKey(WorkoutSessionExercise, on_delete=models.CASCADE)
    set_number = models.PositiveIntegerField()
    weight = models.FloatField(null=True,blank=True)
    reps = models.PositiveIntegerField(null=True,blank=True)

    def __str__(self):
        return f"Set {self.set_number} - {self.weight} lbs x {self.reps}"
