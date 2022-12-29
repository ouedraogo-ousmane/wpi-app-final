import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ChauffeurService } from '../../services/chauffeur.service';
import { Chauffeurs } from './chauffeur';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state,transition,style, animate } from '@angular/animations';
import { Vehicules } from 'src/app/folderModels/modelGestMission/vehicule';
import { VehiculeService } from '../../services/vehicule.service';
import { environment } from 'src/environments/environment';
import { Categories } from './categorie';
import { VehiculeParcs } from './vehiculeParc';
import { VehiculeDocs } from './vehiculeDocs';


@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css'],
  animations : [
    trigger('fade',[
      state('void',style({opacity:0})),
      transition('void =>*',[
        animate(2000)
      ])
    ])
  ]
})
export class ChauffeurComponent implements OnInit {

  // declaration des variables à utiliser

  vehiculeAdded : number = 0;

  listeChauffeur : Chauffeurs[] = [];
  listeCategorie : Categories[] = [];
  listeVehicule : Vehicules[] = [];
  urlChauffeur = 'http://127.0.0.1:8000/admin/missions/chauffeurs/';


  chauffeurSelected :Chauffeurs = new Chauffeurs();
  chauffeur :Chauffeurs = new Chauffeurs();
  isLoading : boolean = true;
  dataSource = new MatTableDataSource<Chauffeurs>();
  selection = new SelectionModel<Chauffeurs>(true, []);
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  clickedRows = new Set<Chauffeurs>();

  displayedColumns: string[] = ['select', 'nom','prenom', 'vehicule','telephone', 'salaire','actions'];
  displayedColumns1: string[] = [ 'id','nom','prenom', 'vehicule','telephone', 'salaire'];
  listeDocuments :string[] = [ 
    'visite technique',
    'assurance'
  ]
  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  @ViewChild('dialogRefUpdate')
  dialogRefUpdate!: TemplateRef<any>;

  @ViewChild('dialogDetail')
  dialogDetail!: TemplateRef<any>;

  @ViewChild('dialogRefDel')
  dialogRefDel!: TemplateRef<any>;

  chauffeurFormGroup! : FormGroup;
  vehiculeFormGroup! : FormGroup;
  vehiculeDocFormGroup! : FormGroup;
  isPrinting : boolean = false;

  vehicule : VehiculeParcs =  new VehiculeParcs();
  categorie : Categories = new Categories();
  vehiculeDoc : VehiculeDocs = new VehiculeDocs();

  next : string = "";
  previous : string = "";

  constructor(
    private chauffeurService : ChauffeurService,
    private snackBar : MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog : MatDialog,
    private vehiculeService : VehiculeService
  ) { }

  ngOnInit(): void {
    this.getAllChauffeur();
    this.getAllVehicules();
    this.getAllCategories();

    console.log(this.listeChauffeur);

    // declaration du formulaire
    this.chauffeurFormGroup = this.formBuilder.group({
      id:this.formBuilder.control(null),
      nom:this.formBuilder.control('',Validators.required),
      prenom:this.formBuilder.control('',Validators.required),
      telephone:this.formBuilder.control('',Validators.required),
      salaire:this.formBuilder.control(100000,Validators.required)
    });
    // Les informations sur un vehicule
    this.vehiculeFormGroup = this.formBuilder.group({
      id:this.formBuilder.control(null),
      categorie:this.formBuilder.control(1,Validators.required),
      immat:this.formBuilder.control('',Validators.required),
      marque:this.formBuilder.control(''),
      couleur:this.formBuilder.control(''),
      //est_disponible:this.formBuilder.control('',Validators.required),
      poids_vide:this.formBuilder.control(600,Validators.required)
    });
    // Les informations sur les documents vehicules
    this.vehiculeDocFormGroup = this.formBuilder.group({
      id:this.formBuilder.control(null),
      intitule:this.formBuilder.control('',Validators.required),
      date_expiration:this.formBuilder.control('',Validators.required),
      //vehiculeConcerne:this.formBuilder.control('',Validators.required)
    });
  }

  openDetail(){
    this.dialog.open(this.dialogDetail,{
      width:'45%'
    });
  }

  cancel(){
    this.dialog.closeAll();

  }

  print(){
    if(this.selection.selected.length>0){
      this.listeChauffeur = this.selection.selected;
    }
    this.isPrinting = true;
    window.print()
    this.isPrinting = false;
  }

  /** Methode de recuperation du contenu du formulaire */

  getFormData(){
    // Sur la chauffeur
    //console.log(this.chauffeurFormGroup.get('nom')?.value)
    this.chauffeur.id = this.chauffeurSelected.id;
    this.chauffeur.nom = this.chauffeurFormGroup.get('nom')?.value;
    this.chauffeur.prenom = this.chauffeurFormGroup.get('prenom')?.value;
    this.chauffeur.telephone = this.chauffeurFormGroup.get('telephone')?.value;
    this.chauffeur.salaire = this.chauffeurFormGroup.get('salaire')?.value;
    console.log(this.chauffeur);
  }

  getVehiculeFormData(){
    // Sur le vehicule
    this.vehicule.id = this.chauffeurSelected.vehiculeInfos.id;
    this.vehicule.immat = this.vehiculeFormGroup.get('immat')?.value;
    this.vehicule.categorie = this.vehiculeFormGroup.get('categorie')?.value;
    this.vehicule.marque = this.vehiculeFormGroup.get('marque')?.value;
    this.vehicule.couleur = this.vehiculeFormGroup.get('couleur')?.value;
    this.vehicule.poids_vide = this.vehiculeFormGroup.get('poids_vide')?.value;
    console.log(this.vehicule);
  }

  getVehiculeDocsFormData(){
    // Sur le vehicule
    this.vehiculeDoc.intitule = this.vehiculeDocFormGroup.get('intitule')?.value;
    this.vehiculeDoc.date_expiration = new Date(this.vehiculeDocFormGroup.get('date_expiration')?.value);

    console.log(this.vehiculeDoc);
  }
  

  setFormData(){
    // Sur la chauffeur
    //console.log(this.chauffeurFormGroup.get('nom')?.value)
    //this.chauffeurFormGroup.get('id')?.setValue(this.chauffeurSelected.id );
    this.chauffeurFormGroup.get('nom')?.setValue(this.chauffeurSelected.nom );
    this.chauffeurFormGroup.get('prenom')?.setValue(this.chauffeurSelected.prenom );
    this.chauffeurFormGroup.get('vehicule')?.setValue(this.chauffeurSelected.vehicule );
    this.chauffeurFormGroup.get('telephone')?.setValue(this.chauffeurSelected.telephone );
    this.chauffeurFormGroup.get('salaire')?.setValue(this.chauffeurSelected.salaire);

    // sur le vehicule
   // this.vehiculeFormGroup.get('id')?.setValue(this.chauffeurSelected.vehiculeInfos.id);
    this.vehiculeFormGroup.get('immat')?.setValue(this.chauffeurSelected.vehiculeInfos.immat);
    this.vehiculeFormGroup.get('categorie')?.setValue(this.chauffeurSelected.vehiculeInfos.categorie);
    this.vehiculeFormGroup.get('marque')?.setValue(this.chauffeurSelected.vehiculeInfos.marque);
    this.vehiculeFormGroup.get('couleur')?.setValue(this.chauffeurSelected.vehiculeInfos.couleur);
    this.vehiculeFormGroup.get('poids_vide')?.setValue(this.chauffeurSelected.vehiculeInfos.poids_vide);

  }

  get isValidchauffeurFormGroup(){
    if(
      this.chauffeurFormGroup.get('nom')?.valid &&
      this.chauffeurFormGroup.get('prenom')?.valid &&
      this.chauffeurFormGroup.get('telephone')?.valid &&
      this.chauffeurFormGroup.get('salaire')?.valid
    ){

      return true;
    }
    return false;
  }

  get isValidVehiculeFormGroup(){
    if(
      this.vehiculeFormGroup.get('immat')?.valid &&
      this.vehiculeFormGroup.get('categorie')?.valid &&
      this.vehiculeFormGroup.get('poids_vide')?.valid 
    ){

      return true;
    }
    return false;
  }

  get isValidVehiculeDocFormGroup(){
    if(
      this.vehiculeDocFormGroup.get('intitule')?.valid &&
      this.vehiculeDocFormGroup.get('date_expiration')?.valid 
    ){

      return true;
    }
    return false;
  }

  /**
   * Opening snacbar method
   */

   openSnackbar(message:string='operation reussie !!!',action:string){
    this.snackBar.open(message,action,{
      verticalPosition:'bottom',
      horizontalPosition:'start',
      duration:5000
    });
  }

  getNextPage(){
    if(this.next.length !=0){
      this.getAllChauffeur(this.next);
    }
  }
  getPreviousPage(){
    if(this.previous.length!=0){
      this.getAllChauffeur(this.previous);
    }
  }

  // methode de recuperation des donnnées chauffeurs

  
  getAllChauffeur(urlChauffeurs :string ="http://127.0.0.1:8000/missions/chauffeurs/"){
    this.isLoading = true;
    this.chauffeurService.getChauffeur(urlChauffeurs).subscribe(
      (dataGetted:any)=>{
        this.listeChauffeur = dataGetted.results;

        console.log(dataGetted);
        this.next = dataGetted.next;
        this.previous = dataGetted.previous;
        this.dataSource = new MatTableDataSource<Chauffeurs>(this.listeChauffeur);
      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      },
      ()=>{
        this.isLoading = false;
      }
    );

  }
  // Methode de recuperation de toutes les categories d'un vehicule
  getAllCategories(){
    this.vehiculeService.getCategorie().subscribe(
      (dataGetted:any)=>{
        this.listeCategorie = dataGetted.results;
        
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("Données recupérées avec succès")
      }
    )
  }

  /**
   * Methode de recuperation de tous les vehicules
   */

   getAllVehicules(){
    this.vehiculeService.getVehicules().subscribe(
      (dataGetted:any)=>{
        this.listeVehicule = dataGetted.results;
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("Données recupérées avec succès")
      }
    )
  }

  // Methode de modification d'un chauffeur

  updateChauffeur(method:string='put'){
    const message = "mise à jour";
    //this.dialog.closeAll();

    let action = "";
    //this.isLoading = true;
    this.getFormData();
    this.chauffeurService.sendOrDeleteChauffeur(this.chauffeur,method).subscribe(
      (dataGetted:any)=>{
        //this.listeChauffeur = dataGetted.results;
        this.getAllChauffeur();
      },
      (error)=>{
        console.log(error);
        action = 'echec';
       // this.isLoading = false;
      },
      ()=>{
       action ='reussie';
       //this.isLoading = false;
       this.openSnackbar(message,action);
       this.chauffeurSelected=new Chauffeurs();
       this.selection.selected.pop();

      }
    );

  }

  // Methode de modification d'un vehicule

  updateVehicule(method:string='put'){
    const message = "mise à jour";
    //this.dialog.closeAll();

    let action = "";
    //this.isLoading = true;
    this.getVehiculeFormData();
    this.vehiculeService.sendOrDeleteVehicule(this.vehicule,method).subscribe(
      (dataGetted:any)=>{
        //this.listeChauffeur = dataGetted.results;
       // this.getAllChauffeur();
      },
      (error)=>{
        console.log(error);
        action = 'echec';
        this.isLoading = false;
      },
      ()=>{
       action ='reussie';
       this.isLoading = false;
       this.openSnackbar(message,action);
       this.chauffeurSelected=new Chauffeurs();
       this.selection.selected.pop();

      }
    );

  }

  get isValid(){
    return false;
  }

  // Methode d'ajout d'un chauffeur

  sendChauffeur(method:string='post'){
    const message = "ajout d'un nouveau chauffeur";
    let action = "";

    if(this.isValidchauffeurFormGroup){
      this.getFormData();
      if(this.vehiculeAdded >0){
        this.chauffeur.vehicule = this.vehiculeAdded;

        this.chauffeurService.sendOrDeleteChauffeur(this.chauffeur,method).subscribe(
          (dataGetted:any)=>{
            //this.listeChauffeur = dataGetted.results;
            this.getAllChauffeur();
            action ='reussie';
          },
          (error)=>{
            console.log(error);
            action = 'echec';
            this.isLoading = false;
          },
          ()=>{
            
            this.openSnackbar(message,action);
            this.isLoading = false;

          }
        );
      }
      
    }else{
      this.openSnackbar('Veuillez remplir tous les champs','Echec');
    }
    
    

  }

  // Methode d'ajout 

  saveVehicule(method:string='post'){
    const message = "ajout d'un nouveau vehicule";
    let action = "";
    if(this.isValidVehiculeFormGroup){
      this.getVehiculeFormData();
      this.vehiculeService.sendOrDeleteVehicule(this.vehicule,method).subscribe(
        (dataGetted:any)=>{
          //this.listeChauffeur = dataGetted.results;
          //this.getAllChauffeur();
          action ='reussie';
          this.vehiculeAdded = dataGetted.id;
          
        },
        (error)=>{
          console.log(error);
          action = 'echec';
          //this.isLoading = false;
        },
        ()=>{
          this.openSnackbar(message,action);
          //this.isLoading = false;

        }
      );
    }else{
      this.openSnackbar('Veuillez remplir tous les champs','Echec');
    }

  }

  saveDocvehicule(method:string='post'){
    const message = "ajout d'un document vehicule";
    let action = "";
    if(this.isValidVehiculeDocFormGroup){
      this.getVehiculeDocsFormData();
      this.vehiculeDoc.vehicule = this.vehiculeAdded;
      this.vehiculeService.sendOrDeleteVehiculeDoc(this.vehiculeDoc,method).subscribe(
        (dataGetted:any)=>{
         
          action ='reussie';
          
        },
        (error)=>{
          console.log(error);
          action = 'echec';
          //this.isLoading = false;
        },
        ()=>{
          this.openSnackbar(message,action);
          //this.isLoading = false;

        }
      );
    }else{
      this.openSnackbar('Veuillez remplir tous les champs','Echec');
    }
  }

  endSaving(){
    this.dialog.closeAll();
    this.vehiculeFormGroup.reset();
    this.chauffeurFormGroup.reset();
    this.vehiculeDocFormGroup.reset();
    
  }

  

  /**
   * Ouverture du modal
   */
   openDialogue(){
    this.dialog.open(this.dialogRef,{
      width:'75%'
    });
  }

  openDialogueUpdate(){
    this.dialog.open(this.dialogRefUpdate,{
      width:'75%'
    });
  }

  /**
   * Ouverture du modal dialogRefDel
   */
   openDialogueConfirm(){
    this.dialog.open(this.dialogRefDel,{
      width:'45%'
    });
  }

  onDelete(){
    this.chauffeurSelected = this.selection.selected[0];
    console.log(this.chauffeurSelected);
    this.openDialogueConfirm();
  }

  onEdit(){
    this.chauffeurSelected = this.selection.selected[0];
    console.log(this.chauffeurSelected);
    this.setFormData();
    this.openDialogueUpdate();
  }

  getCategorie(id:number){
    for(let data of this.listeCategorie){
      if(data.id ==id){
        return data.intitule
      }
    }
    return "pas connue"
  }

  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * Cette methode ci-dessous permet de filtrer les données du tableau
   */
  applyFiltrer(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
    
  }


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.listeChauffeur.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }
  
      this.selection.select(...this.dataSource.data);
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Chauffeurs): any {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
  
    clickedRow(row:Chauffeurs){
      if(this.selection.isSelected(row) ===true){
        this.clickedRows.add(row);
        this.chauffeurSelected = this.selection.selected[0];
        console.log(this.chauffeurSelected);

      }
    }
  

}
