# Generated by Django 4.0.7 on 2022-12-26 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('missions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docstransports',
            name='date_expiration',
            field=models.DateTimeField(),
        ),
    ]
