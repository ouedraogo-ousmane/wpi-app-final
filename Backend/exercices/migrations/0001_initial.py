# Generated by Django 4.0.7 on 2022-11-16 08:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import exercices.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_exercice', models.DateField(unique=True, validators=[exercices.validators.no_TwoExercices])),
                ('etat_exercice', models.BooleanField(default=False)),
                ('createur', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='liste_exercices', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date_exercice'],
            },
        ),
    ]
