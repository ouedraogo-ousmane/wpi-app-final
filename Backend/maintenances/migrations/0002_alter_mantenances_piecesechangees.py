# Generated by Django 4.0.7 on 2022-11-23 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenances', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mantenances',
            name='piecesEchangees',
            field=models.ManyToManyField(blank=True, null=True, through='maintenances.InfosPieces', to='maintenances.piecesechanges'),
        ),
    ]
