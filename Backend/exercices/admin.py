from django.contrib import admin
from .models import Exercices

class ExercicesFilter(admin.ModelAdmin):
    list_display = ('id','date_exercice','totalDepenseMaintenances', 'totalDepenseMission',
                    'recetteTotales')
    list_filter = ('etat_exercice',)
    
admin.site.register(Exercices,ExercicesFilter)

