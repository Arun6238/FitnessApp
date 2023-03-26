# Generated by Django 4.1.7 on 2023-03-26 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_workoutsession_duration'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workoutsessionexercise',
            name='sets',
        ),
        migrations.CreateModel(
            name='Set',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('set_number', models.PositiveIntegerField()),
                ('weight', models.FloatField()),
                ('reps', models.PositiveIntegerField()),
                ('exercise_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.workoutsessionexercise')),
            ],
        ),
    ]