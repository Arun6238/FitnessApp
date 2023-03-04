# Generated by Django 4.1.7 on 2023-03-03 10:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0002_remove_exercise_muscle_exercise_body_part_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MeasurementType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Weight', 'Weight'), ('Height', 'Height'), ('Fat_percentage', 'Fat_percentage'), ('Neck', 'Neck'), ('Shoulders', 'Shoulders'), ('Chest', 'Chest'), ('Left bicep', 'Left bicep'), ('Right bicep', 'Right bicep'), ('Left forearm', 'Left forearm'), ('Upper abs', 'Upper abs'), ('Waist', 'Waist'), ('Lower abs', 'Lower abs'), ('Hips', 'Hips'), ('Left thigh', 'Left thigh'), ('Right thigh', 'Right thigh'), ('Left calf', 'Left calf'), ('Right calf', 'Right calf')], max_length=50)),
                ('unit', models.CharField(max_length=10)),
            ],
        ),
        migrations.AlterField(
            model_name='exercise',
            name='category',
            field=models.CharField(blank=True, choices=[('Barbell', 'Barbell'), ('Dumbbell', 'Dumbbell'), ('Machine/Other', 'Machine/Other'), ('Weighted bodyweight', 'Weighted bodyweight'), ('Assisted body', 'Assisted body'), ('Reps only', 'Reps only'), ('Cardio exercice', 'Cardio exercice'), ('Duration', 'Duration')], max_length=100, null=True),
        ),
        migrations.CreateModel(
            name='BodyMeasurement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('value', models.DecimalField(decimal_places=2, max_digits=6)),
                ('measurement_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.measurementtype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
