# Generated by Django 4.1.7 on 2023-04-05 08:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0016_alter_set_exercise_session'),
    ]

    operations = [
        migrations.AlterField(
            model_name='set',
            name='exercise_session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.workoutsessionexercise'),
        ),
    ]
