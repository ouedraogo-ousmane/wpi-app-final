from django.contrib import admin
from .models import (
    Clients, Produits, VehiculeParcs, VehiculeLoues,
    CategorieVehicules, documentVehicules, Trajets,
    RecetteDetailPesage, RecetteDetailSansPesage,
    Chauffeurs, Missions, LoueurVehicules,
    DepenseMissions, InfoDepenseMissions, Recettes
    )

# Register your models here.

# Parametrage de l'affichage et du filtrage des donnees dans la page d'adminstration
class ClientFilter(admin.ModelAdmin):
    list_display = ('id','nom', 'prenom', 'date_creation','telephone')
class ProduitFilter(admin.ModelAdmin):
    list_display = ('id','nom', 'unite', 'date_creation')
    list_filter = ('unite',)

class VehiculeParcsFilter(admin.ModelAdmin):
    list_display = ('id','immat', 'marque', 'couleur','categorie')
    list_filter = ('est_disponible', 'categorie')

class TrajetsFilter(admin.ModelAdmin):
    list_display = ('id','ville_depart', 'ville_arrivee', 'date_creation')
    list_filter = ('ville_depart', 'ville_arrivee')
class ChauffeursFilter(admin.ModelAdmin):
    list_display = ('id','nom', 'prenom', 'vehicule','salaire','telephone')

class MissionsFilter(admin.ModelAdmin):
    list_display = ('id','date_mission','vehicule_concerne','exercice_conerne', 'trajet_concerne', 'motif')
    list_filter = ('etat_mission','exercice_conerne')

class DepenseMissionsFilter(admin.ModelAdmin):
    list_display = ('id','intitule','date_creation')

class RecettesFilter(admin.ModelAdmin):
    list_display = ('id', 'mission','produit','qte_produit','unite', 'cout_unitaire','client_concerne' ,'date_creation')
    list_filter = ('exercice',)
class CategorieVehiculesFilter(admin.ModelAdmin):
    list_display = ('id','intitule','date_creation')
    list_filter = ('intitule',)

class documentVehiculesFilter(admin.ModelAdmin):
    list_display = ('id', 'intitule', 'vehicule', 'date_expiration', 'nbreJoursRestant', 'nbreMoisRestant')
    list_filter = ('intitule',)
class LoueurVehiculesFilter(admin.ModelAdmin):
    list_display = ('id', 'nom', 'prenom', 'telephone', 'date_creation')

class VehiculeLouesFilter(admin.ModelAdmin):
    list_display = ('id','immat', 'proprietaire' ,'marque', 'couleur','categorie')
    list_filter = ('est_disponible','categorie')

# Enregistrement des models à afficher 
    
admin.site.register(Clients, ClientFilter)
admin.site.register(Produits, ProduitFilter)
admin.site.register(VehiculeParcs, VehiculeParcsFilter)
admin.site.register(VehiculeLoues, VehiculeLouesFilter)
admin.site.register(documentVehicules, documentVehiculesFilter)
admin.site.register(Trajets, TrajetsFilter)
# admin.site.register(RecetteDetailPesage)
# admin.site.register(RecetteDetailSansPesage)
admin.site.register(Chauffeurs, ChauffeursFilter)
admin.site.register(Missions, MissionsFilter)
admin.site.register(CategorieVehicules, CategorieVehiculesFilter)
admin.site.register(LoueurVehicules, LoueurVehiculesFilter)
admin.site.register(DepenseMissions, DepenseMissionsFilter)
#admin.site.register(InfoDepenseMissions)
admin.site.register(Recettes, RecettesFilter) # new 

