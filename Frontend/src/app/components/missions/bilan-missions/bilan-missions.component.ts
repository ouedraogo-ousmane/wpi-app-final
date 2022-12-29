import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AcceuilMissionList } from '../Imission';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';
import {map,startWith} from 'rxjs/operators';
import { SdetailMissionService } from '../detail-mission/sdetail-mission.service';
import { ProgrammerService } from '../programmer/programmer.service';
import { IchauffeursVehicule, Iclients, Idepenses, InfoPesee, Iproduits, Itrajets } from '../programmer/iprogrammer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-bilan-missions',
  templateUrl: './bilan-missions.component.html',
  styleUrls: ['./bilan-missions.component.css']
})
export class BilanMissionsComponent implements OnInit, OnDestroy {

motifs_mission:any[]=['Approvissionnement', 'Livraision'];
listeTrajets:Itrajets[]=[];
listeClients:Iclients[]=[];
listesProduits:Iproduits[] = [];
listesDepenses:Idepenses[] = [];
listeChauffeurs :IchauffeursVehicule [] = [];
exercice_id!:number;

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  is_data_there:boolean = false;
  mission_selected :AcceuilMissionList;

  formMission = this.fb.group({
    date_mission: ['', Validators.required],
    liste_depenses:this.fb.array([]),
    liste_produits:this.fb.array([]),
    liste_new_produit:this.fb.array([]),

      // nouveau initialiser a 0
      infoPoids:this.fb.group({
        premier_poids:[0],
        deuxieme_poids:[0],
      }),
  });

  stepperOrientation: Observable<StepperOrientation>;
  type = new FormControl('', Validators.required);
  trajet = new FormControl('', Validators.required);
  chauffeur =  new FormControl('', Validators.required);
  chauffeur_display= new FormControl(''); // juste pour afficher le nom du chauffeur

  options: string[] = ['One', 'Two', 'Three'];
  type_trajet:string[]=['Approvissionement', 'Livraison']

  filteredOptions!: Observable<string[]>;
  chauffeur_filtre!: Observable<IchauffeursVehicule[]>;
  trajet_filtre!: Observable<Itrajets[]>;
  type_filtre!: Observable<string[]>;
  client_filtre!: Observable<Iclients[]>;

  is_set_driver:boolean = true;

  getProductSelectedClient:any;

constructor(public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data:any,
              private fb: FormBuilder,
              breakpointObserver: BreakpointObserver,
              private detailService:SdetailMissionService,
              private programmerService:ProgrammerService,
              private snackBar : MatSnackBar,
              private route: ActivatedRoute,
            ) {
              this.mission_selected = data,
              this.stepperOrientation = breakpointObserver
              .observe('(min-width: 800px)').pipe(
                map(({matches}) => (matches ? 'horizontal' : 'vertical')));}

  ngOnInit(): void {
    this.getListesChauffeurVehicules();
    this.getListeIntituleTrajets();
    this.getListeClients();
    this.getListeIntituleDepenses();
    this.getListeIntituleProduits();
    this.displaySelectedMissionValue();
    this.AjoutListeDepenseMission_toUpdate();
    this.AjoutListeProduitsMission_toUpdate();
    this.getInfoPesee();

    //this.getInfoPesee();

    this.trajet_filtre=  this.trajet.valueChanges.pipe(
      startWith(''),
      map(value => this.OnTrajet_filter(value || '')),
    );

    this.type_filtre =  this.type.valueChanges.pipe(
      startWith(''),
      map(value => this.Ontype_filter(value || '')),
    );

    this.chauffeur_filtre = this.chauffeur.valueChanges.pipe(
      startWith(''),
      map(value => this.OnChauffeur_filter(value || '')),
    );

    this.exercice_id = this.exercice_parent();
  }

  displaySelectedMissionValue():void{
    this.formMission.get("date_mission")?.setValue(String(this.mission_selected.date_mission));
    this.type.setValue(this.mission_selected.motif
    );
    this.trajet.setValue(this.mission_selected.trajet.ville_depart+"-"+
                        this.mission_selected.trajet.ville_arrivee
    );
    this.chauffeur_display.setValue(this.mission_selected.chauffeur.nom + " " +
              this.mission_selected.chauffeur.prenom
    );

  }

  exercice_parent():number{
    // methode permettant de retourner l'exercice parent d'une mission
    let queryParam:any;

       this.route.queryParamMap  //Recuperation des parametres state d'url : ActivatedRoute
      .subscribe((params) => {
         queryParam = {...params }; // operateur de diffussion

       });
       return queryParam.params.exercice
  }

is_date_panel_expand:boolean[] = [];

  setForcontrol(i:number){
    this.is_date_panel_expand[i] = true;
  }

  delFormControl(i:number){
    this.is_date_panel_expand[i] = false;
  }


  OnTrajet_filter(value: string){
    const trajet_saisie = value.toLowerCase();
    return this.listeTrajets.filter(option => option.intitule.toLowerCase().includes(trajet_saisie));
  }

  Ontype_filter(value: string){
    const type_value = value.toLowerCase();
    return this.type_trajet.filter(type => type.toLowerCase().includes(type_value));
  }

  OnChauffeur_filter(value:string){
    const chauffeur_saissie = value.toLowerCase();

    return this.listeChauffeurs.filter(
      chauff => chauff.chauff.nom.toLowerCase().includes(chauffeur_saissie));
    }

  Onclient_filter(value:string){
    const client_value = value.toLowerCase();
    return this.listeClients.filter(client=>client.nom.toLowerCase().includes(client_value));
  }

  OnclientProdUd_filter(value:string){
    const client_value = value.toLowerCase();
    return this.listeClients.filter(client=>client.nom.toLowerCase().includes(client_value));
  }

  afficherChauffeur(chauffeur:IchauffeursVehicule){
    return chauffeur && chauffeur.chauff.nom ? chauffeur.chauff.nom+ " " +chauffeur.chauff.prenom: "";
  }

  afficherClient(client:Iclients){
    if(client.prenom!=null)
      return client && client.nom?client.nom + " " + client.prenom:"";
    return client && client.nom?client.nom:" ";
  }

/* inter-action avec la bd*/
getListeIntituleTrajets():void{
  this.programmerService.getListeIntituleTrajets()
  .subscribe(
    (data:Itrajets[])=>{
      this.listeTrajets = data;
    },
    error=>{

    },
    ()=>{

    }
  )
}

getListeIntituleProduits():void{
  this.programmerService.getListeIntituleProduits()
  .subscribe(
    (data:Iproduits[])=>{
      this.listesProduits = data;
    },
    error=>{

    },
    ()=>{
       //implementation de l'anatomicite : transaction
    }
  )
}

getListesChauffeurVehicules():void{
this.programmerService.getListesChauffeurVehicules()
.subscribe(
  (data:IchauffeursVehicule[])=>{
    this.listeChauffeurs= data;
    console.log(this.listeChauffeurs);
  },
  error=>{

  },
  ()=>{

  }
)
}

getListeIntituleDepenses():void{
  this.programmerService.getListeIntituleDepenses()
  .subscribe(
    (data:Idepenses[])=>{
      this.listesDepenses= data;
    },
    error=>{

    },
    ()=>{
       //implementation de l'anatomicite : transaction
    }
    )
}

getListeClients():void{
this.programmerService.getListeClients()
  .subscribe(
    (data:Iclients[])=>{
      this.listeClients= data;
      console.log(this.listeClients)
    },
    error=>{

    },
    ()=>{}
    )
}

data_pesee!:InfoPesee[];
getInfoPesee():void{
  // recuperation des information de pesage
  this.detailService.getInfoPesee(this.mission_selected.id).subscribe(
    (data:InfoPesee[])=>{
      this.data_pesee = data;
    },
    (error)=>{
      if(error.status == 404){
      }
    },
    ()=>{
      if(this.data_pesee.length>0){
        this.formMission.get("infoPoids")?.get("premier_poids")?.setValue(
          this.data_pesee[0].premier_pese
        );
        this.formMission.get("infoPoids")?.get("deuxieme_poids")?.setValue(
          this.data_pesee[0].deuxieme_pese
        );
      }
    },
  )
}

// Gestion des depenses

//Pour depenses
  depenseSelectionnes = new FormControl(''); // controle de recuperation des depenses

    // nombre de depenses selectionner
  get nombreDepenses():any{
      const depenseSelection:any= this.depenseSelectionnes.value
      if(depenseSelection?.length!=0){
        return depenseSelection?.length
      }
      return 0
  }

  onSelectionDepenseTeminer(){
      this.AjouterDepenseField();
     // pour desactiver le champs intitule de la depense selectionne
     const fg = this.formMission.get('liste_depenses') as FormArray // recuperation du tabl formarray de depenses

     //   Probleme à resourdre
     fg.controls.forEach(control=>{ // parcours de chaque formGroup
           control.get('intitule')?.disable() // recuperation du champs nom et desactivation
           // ajout de quelques validateurs
           control.get('montant')?.setValidators(Validators.required)
     });

  }

  get depensesFieldAsFormArray():any{
      //methode d'obtention au champs dans le form comme un FormArray
      return this.formMission.get('liste_depenses') as FormArray
  }

  depenseControleur(intitule:string,id:number ,quantite:number, id_intitule:number):any{
    // creation du nouveau controleur à ajouter automatiquement dans le FormArray

    return this.fb.group({
      intitule:this.fb.control(intitule), // utiiser pour l'affichage
      id:this.fb.control(id),
      intitule_depense : [ id_intitule, {validators:[Validators.required]}], // utiiser pour le sauvegard
      montant: [quantite, {validators:[Validators.required]}],
    })}

  AjouterDepenseField():void{
    // ajout du champ au formulaire
    const depensesSelectionne:any= this.depenseSelectionnes.value
    if(depensesSelectionne?.length!=0){
      depensesSelectionne.forEach((element:any) => {
        const depense_to_be_add = this.listesDepenses.find(dep=>dep.id==element) // recuperation du nom

        this.depensesFieldAsFormArray.push(this.depenseControleur(depense_to_be_add?.intitule || ' ',element,0,depense_to_be_add?.id || 0));
        this.depenseSelectionnes.reset()
        });

        this.depenseSelectionnes = new FormControl()
    }


  }

  supprimerDepenseField(i:number):void{
      // suppression du champs du fromulaire
      this.depensesFieldAsFormArray.removeAt(i)
  }

  AjoutListeDepenseMission_toUpdate(){
    this.mission_selected.depenses.forEach(element=> {
        this.depensesFieldAsFormArray.push(
          this.depenseControleur(element.intitule_depense__intitule,element.id || 0,element.montant,element.intitule_depense__id || 0));
    })
}
// non utiliser
updateTrajet():void{
  if(this.trajet?.value!=(this.mission_selected.trajet.ville_depart+"-"+this.mission_selected.trajet.ville_arrivee))
  {
    const trajet:Itrajets[] = this.listeTrajets.filter(trajet=>this.trajet?.value == trajet.intitule);

    const newtrajet:Itrajets = {
      id:trajet[0].id,
      intitule:this.trajet?.value || ''
    }

    console.log(newtrajet);
    this.detailService.updateTrajet(newtrajet).subscribe(
      (data:Itrajets)=>{
        // console.log(data)
      },
      (error)=>{
        this.openSnackbar("Modifier Trajet","Erreur!!");
        console.log(error);
      },
      ()=>{
        this.openSnackbar("Modifier Trajet","Success!!!");
      },
    )
  }

}
updateProduitList():void{
  // ajout et modification

   const listesProduits:any[] = this.formMission.get('liste_produits')?.value || [];
   let client:number = 0;

   listesProduits.forEach(element=>{
     element.exercice = Number(this.exercice_id);
     element.mission = this.mission_selected.id;
     client = this.mission_selected.produits.find(value=>value.id == element.id)?.client_concerne__id || 0
     element.client_concerne = client;
   })

   console.log(listesProduits);
   listesProduits.map(element=>{
     this.detailService.updateListeProduits(element).subscribe(
       (data)=>{
         ////console.log(data)
       },
       (error)=>{

         this.openSnackbar("Liste de produits modifier erreur: ","Erreur");
       },
       ()=>{

       }
     )
   })

   // suppression: recuperer les produits supprimer

   let is_find:any;

   this.mission_selected.produits.forEach(element=>{
     is_find = listesProduits.find(value=>value.id === element.id)

     if(is_find == undefined) {
       this.detailService.deleteListeProduits(element.id||0).subscribe(
         (data)=>{
           //console.log(data)
         },
         (error)=>{

          },
         ()=>{
          this.openSnackbar(" Produits suppression avec: ","success!!");
         },
       )}
   })
}
updateDepenseList():void{
   let liste_depenses:any[] = this.formMission.get('liste_depenses')?.value || [];

   // make it corresponding with the db depense structure
   liste_depenses.forEach(element=>{
     element.exercice = this.exercice_id;
     element.mission = this.mission_selected.id;

   })
     // ajout && modification
   liste_depenses.map(element=>{
     this.detailService.updateListeDepenses(element).subscribe(
       (data)=>{
         //console.log(data)
       },
       (error)=>{
           if(error.status== 404){
             this.programmerService.saveListeDepenses([element]).subscribe(
               (data)=>{
                 this.mission_selected.depenses.push(data) // eviter de le chercher lors de la supression
               },
               (error)=>{
                 this.openSnackbar("Modifier depenses ","Erreur");

               },
               ()=>{
               },
             );
           }

         },
       ()=>{
         this.openSnackbar("Modification mission","succès !!!");
       },
     );
   })

   // suppression: recuperer les depenses supprimer

   let is_find:any;

   this.mission_selected.depenses.forEach(element=>{
     is_find = liste_depenses.find(value=>value.id === element.id)

     if(is_find == undefined) {
       this.detailService.deleteListeDepenses(element.id||0).subscribe(
         (data)=>{
           //console.log(data)
         },
         (error)=>{

         },
         ()=>{},
       )}
   })


}

    // ecouter apres chaque selection de produit
onSelectionNewTeminer(){
  this.AjouterNewProduitField();

  // pour desactiver le champs nom du produit selectionne
  const fg = this.formMission.get('liste_new_produit') as FormArray // recuperation du tabl formarray de produit

  // Probleme à resoudre
   fg.controls.forEach(control=>{ // parcours de chaque formGroup
         control.get('Newnom')?.disable() // recuperation du champs nom et desactivation
         // ajout de quelque validateurs
        control.get('qte_New_produit')?.setValidators(Validators.required)
        control.get('cout_New_unitaire')?.setValidators(Validators.required)
        control.get('client_New_concerne')?.setValidators(Validators.required)
  })
}

get produitsNewFieldAsFormArray():any{
   //methode d'obtention au champs dans le form comme un FormArray
    return this.formMission.get('liste_new_produit') as FormArray
}

produitsNewControleur(nom:string, id:number,quantite:number, cout_unitaire:number, prod_id:number):any{
// creation du nouveau controleur à ajouter automatiquement dans le FormArray

return this.fb.group({
  produit:this.fb.control(id),
  Newnom : this.fb.control(nom),
  id:this.fb.control(prod_id),
  qte_New_produit:[quantite, [Validators.required]],
  cout_New_unitaire:[cout_unitaire, [Validators.required]],
  client_New_concerne:['', []]
})
}


get nombreNewProduit():any{
const produitSelectionne:any= this.produitSelectionnes.value
if(produitSelectionne?.length!=0){
  return produitSelectionne?.length
}
return 0
}

AjouterNewProduitField():void{
 // ajout du champ au formulaire
const produitSelectionne:any= this.produitSelectionnes.value

if(produitSelectionne?.length!=0){
   produitSelectionne.forEach((element:any) => { // chaque element est un id
     const prod_to_be_add = this.listesProduits.find(prod=>prod.id==element) // ajout du nom du produit
    this.produitsNewFieldAsFormArray.push(this.produitsNewControleur(prod_to_be_add?.nom || ' ',element,0, 0, prod_to_be_add?.id || 0));

    this.produitSelectionnes.reset()
    });
}
}

supprimerNewProduitField(i:number):void{
   // suppression du champs du fromulaire
  this.produitsNewFieldAsFormArray.removeAt(i);

}

// snack bar de success
openSnackbar(message:string,action:string){
  this.snackBar.open(message,action,{
    verticalPosition:'top',
    horizontalPosition:'end',
    duration:6000,

  });
}

// pesee info
saveInfosNewProduit(id:number){

const listesProduits:any[] = this.formMission.get('liste_new_produit')?.value || []
let prod_instance:any[] = [];

if(listesProduits.length>0){

    listesProduits.forEach(produit=>{
      const prod = {
        cout_unitaire: produit.cout_New_unitaire,
        qte_produit: produit.qte_New_produit,
        produit: produit.produit,
        mission:id ,
        client_concerne: produit.client_New_concerne.id,
        exercice: Number(this.exercice_id)
      }

      prod_instance.push(prod)
    });

    this.programmerService.saveListeProduits(prod_instance).subscribe(
      (data)=>{
        //console.log(data)
      },
      (error)=>{
        ;
        this.openSnackbar("Produits Enregistrement erreur: ","Erreur");
      },
      ()=>{
        this.openSnackbar("Produits Enregistrement: ","succès !!!");
      },
    )
}
}

updateInfoPesee():void{
  if(this.data_pesee.length === 0)
    this.saveInfoPesee();

  else{

      const instance_poids:InfoPesee = {
        id:this.data_pesee[0].id,
        id_mission: this.mission_selected.id,
        premier_pese:this.formMission.get('infoPoids')?.get('premier_poids')?.value || 0,
        deuxieme_pese: this.formMission.get('infoPoids')?.get('deuxieme_poids')?.value || 0,
      }
      this.detailService.updateInfoPesee(instance_poids).subscribe(
        (data:InfoPesee)=>{
          //console.log(data)
        },
        (error)=>{
              console.log(error.error);
        },
        ()=>{},
      )
  }

    // envoie de l'object

}

saveInfoPesee():void{

  // construction de l'object
  const instance_poids:InfoPesee = {
    id_mission: this.mission_selected.id,
    premier_pese:this.formMission.get('infoPoids')?.get('premier_poids')?.value || 0,
    deuxieme_pese: this.formMission.get('infoPoids')?.get('deuxieme_poids')?.value || 0,
  }

  // envoie de l'object
  this.detailService.saveInfoPesee(instance_poids).subscribe(
    (data:InfoPesee)=>{
      //console.log(data)
    },
    (error)=>{

    },
    ()=>{
    },
  )
}

deleteInfoPesee():void{
  // suppression
  if(this.data_pesee.length!= 0){
    const id:number = this.data_pesee[0].id || 0;

    this.detailService.deleteInfoPesee(id).subscribe(
      (data:InfoPesee)=>{
        //console.log(data);
      },
      (error)=>{
        ;
      },
      ()=>{},
    )
  }

}

  //Pour Produit
  produitSelectionnes = new FormControl(''); //

  // ecouter apres chaque selection de produit
onSelectionTeminer(){
   this.AjouterProduitField();

   // pour desactiver le champs nom du produit selectionne
   const fg = this.formMission.get('liste_produits') as FormArray // recuperation du tabl formarray de produit

   // Probleme à resoudre
    fg.controls.forEach(control=>{ // parcours de chaque formGroup
          control.get('nom')?.disable() // recuperation du champs nom et desactivation
          // ajout de quelque validateurs
          control.get('quantite')?.setValidators(Validators.required)
          control.get('cout_unitaire')?.setValidators(Validators.required)
          control.get('client')?.setValidators(Validators.required)
    })
}

get produitsFieldAsFormArray():any{
    //methode d'obtention au champs dans le form comme un FormArray
    return this.formMission.get('liste_produits') as FormArray
}

//Iclients{ id:number, nom:string, prenom:string}
produitsControleur(nom:string, id:number,quantite:number, cout_unitaire:number,
                  prod_id:number, client:Iclients={ id:1, nom:'', prenom:''}):any{
  // creation du nouveau controleur à ajouter automatiquement dans le FormArray

  return this.fb.group({
    produit:this.fb.control(id),
    nom : this.fb.control(nom),
    id:this.fb.control(prod_id),
    qte_produit:[quantite, [Validators.required]],
    cout_unitaire:[cout_unitaire, [Validators.required]],
    client_concerne:this.fb.control(client)
  })
}

get nombreProduit():any{
  const produitSelectionne:any= this.produitSelectionnes.value
  if(produitSelectionne?.length!=0){
    return produitSelectionne?.length
  }
  return 0
}

AjouterProduitField():void{

  // ajout du champ au formulaire
  const produitSelectionne:any= this.produitSelectionnes.value

  if(produitSelectionne?.length!=0){
    if(produitSelectionne !=null){
        produitSelectionne.forEach((element:any) => { // chaque element est un id
          const prod_to_be_add = this.listesProduits.find(prod=>prod.id==element) // ajout du nom du produit
          this.produitsFieldAsFormArray.push(
            this.produitsControleur(prod_to_be_add?.nom || ' ',element,0, 0, prod_to_be_add?.id || 0));
          this.produitSelectionnes.reset()
          });
    }
  }
}

supprimerProduitField(i:number):void{
    // suppression du champs du fromulaire
    this.produitsFieldAsFormArray.removeAt(i)
}

// autocomplete de client
client_ProdUPdfilter!: Observable<Iclients[]>;

getProduitsTitle(controleur:any):string{
  this.client_filtre = controleur.controls["client_New_concerne"].valueChanges.pipe(
    startWith(''),
    map(value => this.Onclient_filter(String(value) || '')),
  );

  return "";
}
getProduitsTitleProd(controleur:any):string{
  this.client_ProdUPdfilter =  controleur.controls["client_concerne"].valueChanges.pipe(
    startWith(''),
    map(value => this.OnclientProdUd_filter(String(value) || '')),
  );
  return "";
}

// le cout unitaire n'est pas geré
AjoutListeProduitsMission_toUpdate(){
  this.mission_selected.produits.forEach(element=>{
    //Iclients{ id:number, nom:string, prenom:string}
    const client = {
      id:element.client_concerne__id || 0,
      nom:element.client_concerne__nom,
      prenom:element.client_concerne__prenom
    }

    const id_chaine = element.produit__id+","+this.mission_selected.id+","+element.client_concerne__id
    let cout_unitaire:number = 0;
    this.detailService.infoProduitCout(id_chaine).subscribe(
      (data:{cout_unitaire:number, id:number}[])=>{
        cout_unitaire = data[0].cout_unitaire
        console.log(data)
      },
      (error)=>{
        console.log(error)
      },
      ()=>{

        this.produitsFieldAsFormArray.push(
          this.produitsControleur(
            element.produit__nom,element.produit__id || 0,element.qte_produit,
            cout_unitaire, element.id || 0, client)
            );
      },
    )
  })
}
// enregistere mission

  // SECTION Update MISSION

  get isMissionFormulaireValide():boolean{
    return this.formMission.valid;
}

saveMission(){
  // mise a jour des differents champs
  if(this.isMissionFormulaireValide){
    this.updateProduitList();
    this.saveInfosNewProduit(this.mission_selected.id);
    this.updateDepenseList();
    this.updateInfoPesee();
    this.updateMission(); // uniquement la date et le trj
  }
}


updateMission(){

  const date = moment(String(this.formMission.get("date_mission")?.value)).format('YYYY-MM-DD');

  // si le trj ou la date a ete modifier
  if(date!=String(this.mission_selected.date_mission) ||
      ( this.trajet?.value!=(this.mission_selected.trajet.ville_depart+"-"+this.mission_selected.trajet.ville_arrivee)) ||
      this.type?.value!=this.mission_selected.motif
  ){
    const trajet:Itrajets[] = this.listeTrajets.filter(trajet=>this.trajet?.value == trajet.intitule);

    const mission_instance:any = {
        id:this.mission_selected.id,
        exercice_conerne:Number(this.exercice_id),
        vehicule_concerne:this.mission_selected.vehicule.id ,
        trajet_concerne:trajet[0].id,
        motif:this.type?.value ||'',
        etat_mission:false,
        date_mission:moment(String(this.formMission.get("date_mission")?.value)).format('YYYY-MM-DD')
    }

    this.detailService.updateMission(mission_instance).subscribe(
      (data)=>{
        ////console.log(data);
      },
      (error)=>{
        this.openSnackbar("Erreur: ","Erreur");
      },
      ()=>{
        this.openSnackbar("Date de mission: "," Modifier !!!");
      }
    )
  }
}

get is_data_loading(){
  return (this.listeTrajets.length>0 && this.listeClients.length>0
          && this.listesProduits.length>0 && this.listesProduits.length>0
          && this.listeChauffeurs.length>0)
}


ngOnDestroy(): void {
  //this.sub.unsubscribe();
}

}
