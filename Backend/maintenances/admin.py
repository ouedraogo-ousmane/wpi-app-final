from django.contrib import admin
from .models import Mantenances, PiecesEchanges, InfosPieces
# Register your models here.

class MantenancesFilter(admin.ModelAdmin):
    list_display = ('id','exerciceConcerne', 'date_maintenance','vehiculeConcerne','motif','montant')

class PiecesEchangesFilter(admin.ModelAdmin):
    list_display = ('id','nom', 'date_creation')

class InfosPiecesFilter(admin.ModelAdmin):
    list_display = ('id','maintenanceConcernee', 'nomPiece','nombre','coutUnitaire', 'prix_Achat')

admin.site.register(Mantenances, MantenancesFilter)
admin.site.register(PiecesEchanges,PiecesEchangesFilter)
admin.site.register(InfosPieces, InfosPiecesFilter)