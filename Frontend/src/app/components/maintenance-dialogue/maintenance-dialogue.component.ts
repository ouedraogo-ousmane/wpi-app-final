import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup } from '@angular/forms';
import { Piece } from 'src/app/folderModels/modelGestMaintenance/pieces';
import { Maintenances } from '../../folderModels/modelGestMaintenance/maintenance';
import { InfosEnregPiece } from '../../folderModels/modelGestMaintenance/infos-enreg-pieces';
import { MaintenanceService } from '../../services/maintenance.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { VehiculesDuParc } from '../../folderModels/modelGestMission/vehicule-du-parc';
import { Vehicules } from 'src/app/folderModels/modelGestMission/vehicule';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintenance-dialogue',
  templateUrl: './maintenance-dialogue.component.html',
  styleUrls: ['./maintenance-dialogue.component.css']
})
export class MaintenanceDialogueComponent implements OnInit {

  /**
   * Declaration des variables à utiliser
   */
  maintenance :Maintenances = new Maintenances();
  piece : Piece = new Piece();
  infosEnreg : InfosEnregPiece = new InfosEnregPiece();
  listePieceAjoutee :number[] = [];  
  pieceAdded : number = 0;
  maintenanceAdded : number = 0;
  listeVehicule : Vehicules[] = [];
  listePiece : Piece[] = [];
  listePieceGetted : Piece[] = [];
  listeMaintenance : any;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private snackBar : MatSnackBar,
              private dialogue : MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: {id_exercice: number},
              private serviceVehicule : VehiculeService,
              private serviceMaintenance : MaintenanceService) {}
 

  ngOnInit(): void {

    this.getAllVehicules();
    this.getAllPieces();
    this.firstFormGroup = this.formBuilder.group({
      dateEntree:this.formBuilder.control(''),
      vehicule:this.formBuilder.control('',Validators.required),
      motif:this.formBuilder.control('',Validators.required),
      coutMaint:this.formBuilder.control('',Validators.required),
      reference:this.formBuilder.control(null)
  });
    this.secondFormGroup = this.formBuilder.group({
      piece:this.formBuilder.control('',Validators.required),
      prix:this.formBuilder.control(''),
      dureeDevie:this.formBuilder.control(''),
      quantite:this.formBuilder.control('')
    });
  }



  /**
   * Opening snacbar method
   */

  openSnackbar(action:string){
    this.snackBar.open('operation reussie !!!',action,{
      verticalPosition:'bottom',
      horizontalPosition:'start',
      duration:5000
    });
  }

/**
 * Validation du formulaire
 */

  get isValid() {

    if(this.firstFormGroup.get('vehicule')?.valid &&
      this.firstFormGroup.get('coutMaint')?.valid &&
      this.firstFormGroup.get('dateEntree')?.valid){
      return true
    } 
    return false;
    
  }

  get isValidSecondForm() {

    if(this.secondFormGroup.get('piece')?.valid){
      return true
    }
    return false;
    
  }


  /** Methode de recuperation du contenu du formulaire */

  getFormData(){
    // Sur la maintenance
    // this.maintenance.id = this.firstFormGroup.get('id_maint')?.value;
    console.log(this.firstFormGroup.get('coutMaint')?.value)
    this.maintenance.montant = this.firstFormGroup.get('coutMaint')?.value;
    this.maintenance.date_maintenance = new Date(this.firstFormGroup.get('dateEntree')?.value);
    this.maintenance.motif = this.firstFormGroup.get('motif')?.value;
    this.maintenance.exerciceConcerne = this.data.id_exercice;
    this.maintenance.vehiculeConcerne = this.firstFormGroup.get('vehicule')?.value;


    //console.log(this.maintenance);


    // Sur la piece
    //this.piece.id = this.secondFormGroup.get('id_piece')?.value;
    this.piece.nom = this.secondFormGroup.get('piece')?.value;
   // this.piece.dvie_piece = this.secondFormGroup.get('dureeDevie')?.value;

    // Les infos supplementaires
    this.infosEnreg.maintenanceConcernee = this.firstFormGroup.get('id_maint')?.value;
    this.infosEnreg.nomPiece = this.secondFormGroup.get('id_piece')?.value;
    this.infosEnreg.coutUnitaire     = this.secondFormGroup.get('prix')?.value;
    this.infosEnreg.nombre = this.secondFormGroup.get('quantite')?.value;
  }

  /**
   * Cette methode ci-dessous permet de recuperer toutes les maintenances
   */

  getAllMaintenance(url:string= "http://127.0.0.1:8000/maintenances/"){
    this.serviceMaintenance.getMaintenance(url).subscribe(
      (dataGetted:any)=>{

        this.listeMaintenance = dataGetted.results;
        console.log(this.listeMaintenance)

      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("données totalement recupérés");
      }
    )
  }

  
  /**
   * Methode permettant d'enregistrer une maintenance
   */
  saveMaintenance(): void{
    this.getFormData();
    
    this.serviceMaintenance.sendOrDeleteMaintenance(this.maintenance,"post").subscribe(
      (value:any)=>{
        this.maintenanceAdded = value.id;
        this.maintenance.id =  this.maintenanceAdded;
        this.getAllMaintenance();

        console.log(value);
        
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("une operation d'envoie a été effectué");
        
        
      }
    )
  }

  /**
   * suppression d'une maintenance
   */

  deleteMaintenance():void{

    this.serviceMaintenance.sendOrDeleteMaintenance(this.maintenance,"delete").subscribe(
      (dataGetted:any)=>{
        //console.log(dataGetted);
        this.openSnackbar('suppression');

      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        this.firstFormGroup.reset();
      }
    )

  }

  

  /**
   * Definition des methodes sur la gestion des pièces
   */

  /**
   * Enregistrement d'une pièce
   */
  savePiece(){

    this.getFormData();
    this.infosEnreg.maintenanceConcernee = this.maintenanceAdded;
    console.log(this.piece)
    this.serviceMaintenance.sendOrDeletePiece(this.piece,"post").subscribe(
      (value:any)=>{
        this.pieceAdded = value.id;
        this.piece.id = this.pieceAdded;
        this.infosEnreg.nomPiece = this.pieceAdded;
        this.serviceMaintenance.sendOrDeleteInfosEnregistrement(this.infosEnreg,"post").subscribe(
          (value:any)=>{
            console.log(value);
            
            
          }
        )
      }
    )

  }
  /**
   * suppression d'une pièce
   */
  deletePiece(){

    this.serviceMaintenance.sendOrDeletePiece(this.piece,"delete").subscribe(
      (dataGetted:any)=>{
        console.log(dataGetted);
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("one piece have been deleted succesfully");
        this.secondFormGroup.reset();
      }
    )


  }

  /**
   * Modification d'une pièce
   */

  updatePiece(){
    this.serviceMaintenance.sendOrDeletePiece(this.piece,"put").subscribe(
      (dataGetted:any)=>{
        console.log(dataGetted);
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log("one piece have been deleted succesfully");
      }
    )
  }

  /**
   * Cette methode ci-dessous permet tout simplement de terminer la procedure d'enregistrement
   */

  endSaving(){
    this.getAllMaintenance();
    this.dialogue.closeAll();
    this.openSnackbar('ajout !');
  }

  /**
   * Methode de recuperation de tous les vehicules
   */

  getAllVehicules(){
    this.serviceVehicule.getVehicules().subscribe(
      (dataGetted:any)=>{
        this.listeVehicule = dataGetted.results;
        console.log(this.listeVehicule);
      },
      (error)=>{
        console.log("Erreur détecté lors de la recuperation");
      },
      ()=>{
        console.log("Données recupérées avec succès")
      }
    )
  }

   /**
   * Methode de recuperation de toutes les pièces
   */

    getAllPieces(){
      this.serviceMaintenance.getPieces().subscribe(
        (dataGetted:any)=>{
          this.listePiece = dataGetted.results;
          console.log(this.listePiece);
        },
        (error)=>{
          console.log("Erreur détecté lors de la recuperation");
        },
        ()=>{
          console.log("Données recupérées avec succès")
        }
      )
    }

    getFormPiece(){
      this.getFormData();
      this.listePieceGetted.push(this.piece);
      this.secondFormGroup.reset();
      console.log(this.listePieceGetted);
    }


}
