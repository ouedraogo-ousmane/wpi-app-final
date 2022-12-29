
import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcceuilMissionList } from '../Imission';
import { IlisteMission, MissionService } from '../mission.service';
import { ModalActionMissionComponent } from '../modal-action-mission/modal-action-mission.component';

// data table
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { BilanMissionsComponent } from '../bilan-missions/bilan-missions.component';


@Component({
  selector: 'app-liste-mission',
  templateUrl: './liste-mission.component.html',
  styleUrls: ['./liste-mission.component.css']
})
export class ListeMissionComponent implements OnInit, OnDestroy {

  @Output() isdetail: boolean = false;

  @Output()
  mission_selected: EventEmitter<AcceuilMissionList> = new EventEmitter();

  @Output()
  mission_to_be_print:EventEmitter<AcceuilMissionList> = new EventEmitter();

  @Output()
  go_menu_acceil:EventEmitter<string> = new EventEmitter();

  sub:Subscription = new Subscription();
  isWait : boolean = true;
  exercice_id:number = -1; // exercice parent à la mission

  //ajout
 typesOfShoes: string[] = ['ouedradrogo Amado', 'Karim Is', 'Ms  salif', 'Moccasins', 'Sneakers'];

 menuMission:any[]=[
     {nom:'Acceuil', ulrs:'acceuil'},
     {nom:'Nouvelle mission', urls:'programmer'},
 ];

 endPointGlobal:string = '';
 navigationSelected = new FormControl('');
  fontStyle?: string;

  //matRipple

  @ViewChild(MatSort) sort!: MatSort;

 constructor
 (
    private route : ActivatedRoute,
    private router: Router,
    private serviceMission:MissionService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.exercice_parent(); // id de l'exercice
  }

  ngAfterViewInit() {
    // liste mission trié
    this.dataSource.sort = this.sort;
  }

  filterNomChauffeur(){
    let filterFunction = (data:AcceuilMissionList, filter:string):boolean=>{
      if(filter){
        const chauffeur = data.chauffeur;

        if(chauffeur.nom == filter) return true;
        return false
      }
      else return true
    }
    return filterFunction
  }

  choiceMission(missionSelected:any){
    console.log(missionSelected)
  }
  // recuperation de l'exercice choisi

  exercice_parent():void{
    // methode permettant de retourner l'exercice parent d'une mission

    let queryParam:any;

       this.route.queryParamMap  //Recuperation des parametres state d'url : ActivatedRoute
      .subscribe((params) => {
         queryParam = {...params }; // operateur de diffussion

       });
       this.exercice_id = queryParam.params.exercice
       //recuperer la liste des missions qui lui sont relative
       const endpointListeMission = "http://127.0.0.1:8000/missions/acceuil/?exercice="+this.exercice_id
       this.endPointGlobal = endpointListeMission
       this.getListeMissionAcceuil(endpointListeMission);
  }

  // SECTION GET -->Liste des missions : {id, chauffeur{nom, prenom, etat_mission}}
  listeMissionTerminee:AcceuilMissionList[]=[];
  listeMissionEnCours:AcceuilMissionList[]=[];
  listeMission:AcceuilMissionList[] = [];
  pageMissionSuivant:string= ''; // contenir l'url des pages suivant
  pageMissionPrecedent:string=''; // contenir l'url des pages precedents

  getListeMissionAcceuil(endpointListeMission:string){
    /* recuperqtion de la liste des missions */

      let settingDePagination:IlisteMission; // variable local pour la configuration de pagination

      this.sub = this.serviceMission.getListeMission(endpointListeMission)
      .subscribe(
        (data:IlisteMission)=>{
          this.listeMission = data.results; // utiliser pour le filtrage

          //passage des données au tableau
          this.dataSource = new MatTableDataSource<AcceuilMissionList>(this.listeMission);

           settingDePagination = data // stockage du resultat pour l'extration des params: next et previous
           // impossible de les affectés directement au var de pagination
        },
        (error:any)=>{
          console.log(error)
        },
        ()=>{

            this.filterMissionStatus(); // fonction de filtrage en fontion du status des missions

            // definition des parametres de pagination
            if(settingDePagination.next==null) this.pageMissionSuivant = ' '; // important pour eviter les urls null
            else this.pageMissionSuivant = settingDePagination.next;

            if(settingDePagination.previous ==null) this.pageMissionPrecedent =' '; // important pour eviter les urls null
            else this.pageMissionPrecedent=settingDePagination.previous;

            this.isWait = false;
        }
      )

  }


// methode GET de pagination
  getMissionListPagination(is_pageSuivant:boolean){
    /**
     * Ecoute la direction choisie si l'url n'est pas null
     * alors GET
     */
    switch(is_pageSuivant){
      case true:
        if(this.pageMissionSuivant != ' ')
        {
          // probleme : le filtrage doit etre fait en fonction du choix de l'etat
           this.getListeMissionAcceuil(this.pageMissionSuivant);
          }
      break;

      case false:
        if(this.pageMissionPrecedent != ' ')
        { this.getListeMissionAcceuil(this.pageMissionPrecedent);}

      break;
    }
  }

// SECTION Update (avec Patch) : changer l'etat des mission à true
  onUpdateMissionStatus(missionSelection:any[]){
      // recuperer la liste des elements à supprmer

    missionSelection.forEach((obj)=>{
        //modifier l'etat de la mission

        if(obj.etat_mission == false){
            obj.etat_mission = true;
          }
        else {
          obj.etat_mission = false;
        }
        //
        this.serviceMission.endMission(obj).subscribe(
          (data:any)=>{
              console.log(data);
          },
          (error:any)=>{
              console.log(error);
              this.openSnackbar("Error de Modifation de l'etat !!!","");

          },
          ()=>{
            this.selection.clear(); // vidage de table de selection
            this.openSnackbar("Modification  de etat mission !!!","Success ");
            this.getListeMissionAcceuil(this.endPointGlobal)
          }
        )
    })
  }

// SECTION Delete --> Missions
onSupprimerMissions(missionSelection:any[]){

    // recuperer la liste des elements à supprmer

    missionSelection.forEach((obj)=>{

      this.serviceMission.deleteMission(obj.id).subscribe(
        (data:any)=>{
            console.log(data)
        },
        (error:any)=>{
            console.log(error)
          this.openSnackbar("Error de suppression !!!","");

        },
        ()=>{
          this.selection.clear(); // vidage de table de selection
          this.openSnackbar("Mission supprimer !!!","Success");
          this.getListeMissionAcceuil("http://127.0.0.1:8000/missions/acceuil/?exercice="+this.exercice_id);

        }
      )
    })

  }

// menu de navigation dans le component
  isAcceuilMission : boolean = true;
  isProgrammerMission : boolean = false;
  isBilan: boolean = false;
  isRetour:boolean = false;
  isImprimer:boolean = false;

  retourToMission:boolean = false;

  openImprimerMission(){
    // envoie de la mission selection pour impression
    this.mission_to_be_print.emit(this.selection.selected[0]);
  }

  // go to detail des missions
  missionSelectedDetail!:AcceuilMissionList

  openDetailMission():void{
    // envoie de la mission selection pour modification
    this.mission_selected.emit(this.selection.selected[0]);
  }
  openMenuSeleted():void{
    if(this.navigationSelected.value === "Nouvelle mission") this.go_menu_acceil.emit('programmer');
    if(this.navigationSelected.value === "Bilan") this.go_menu_acceil.emit('bilan');
  }

    // modal de confirmation: de terminaison ou de suppression
  delai_animation_apparution:string = '300ms';
  delai_animation_disparition:string = '300ms';

  // modal supprimer et modifier
  openDialog(enterAnimationDuration: string,
            exitAnimationDuration: string,
            textWarning:string,
            bg_action:string): void {

    if(this.selection.selected.length>0){
            // parametres de configuration du component modal
            const dialogRef = this.dialog.open(ModalActionMissionComponent, {
              width: '60%',
              enterAnimationDuration,
              exitAnimationDuration,
              disableClose:true,
              height:"250px",
              data:textWarning,
              panelClass:bg_action, // background color
              hasBackdrop:true,
              backdropClass:'backdrop-color',
          });

          // EventEnitter à la fermeture du modal
          dialogRef.afterClosed().subscribe(result => {
            if(result=='true' && this.selection.selected.length>0){

              switch(textWarning){
                case 'Etes-Vous sûr de vouloir suppprimer ces missions ?' :
                    this.onSupprimerMissions(this.selection.selected);
                break;

                case 'Etes-Vous sûr de vouloir modifier etat de ces missions ?' :
                    this.onUpdateMissionStatus(this.selection.selected);
                break;
              }
            }else{
              this.selection.clear();
            }
        });
      }
  }

  // modal edition
  open_Edit_Dialog() {

    if(this.selection.selected.length>0){
      const dialogRef = this.dialog.open(BilanMissionsComponent,  {
        width: '65%',
        disableClose:true,
        data:this.selection.selected[0]
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if(result=='true' && this.selection.selected.length>0){
          //
        }else{
          this.selection.clear();
          this.exercice_parent();
        }

      });
    }else{
      // pas ouvrir le modal
    }

  }
  // ---- Tableau de listage des exercices ---
    /***
     * Utilisation de materiel table :
     * Adapter le datasource au votre et la liste des colonnes à afficher
     * puis utiliser selection pour recuperer la liste des elements selectionnés
     * : on config les paramétres:displayedColumns, dataSource, selection
     *
    * SelectionModel pour avoir la liste des elements selectionnée on utilise
    * la propriété  : selected (exple: selection.selected) return un tableau de la liste
    * des elements selectionnés
   */

    // parametre a configuré
  displayedColumns: string[] = ['select', 'Position', 'Nom', 'Prenom', 'Vehicules', 'Trajets','Motifs' ,'Date', 'Actions'];
  dataSource = new MatTableDataSource<AcceuilMissionList>(); // voir l'affectation des dans getListeMission()
  selection = new SelectionModel<AcceuilMissionList>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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
  checkboxLabel(row?: AcceuilMissionList): string {

    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

    /**
   * Opening snacbar method
   */

openSnackbar(message:string='operation reussie !!!',action:string){
      this.snackBar.open(message,action,{
        verticalPosition:'top',
        horizontalPosition:'end',
        duration:6000
      });
    }

// --fin data table ---

  // filtrage par status de mission

  filtrage_donnees(event: Event) {
    /**
     * fonction de filtrage des données
     */
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


  }

  filterMissionStatus(){
    /**
     * fonction de triage des missions en fonction de leur etat
     *
     * */

    if(this.listeMission.length!=0){
      this.listeMissionTerminee = this.listeMission.filter((obj)=>{
        return obj.etat_mission == true
      });

      this.listeMissionEnCours =  this.listeMission.filter((obj)=>{
        return obj.etat_mission == false
      });

    }

    // par defaut la liste des mission en cours
  }

  listerMissionParStatus(statusCh:any){
    // bouton de filtrage de mission en fonction du status : changement du contenu du tableau
    // listeMission en fonction du cas

    if(statusCh == false)
        this.dataSource =  new MatTableDataSource<AcceuilMissionList>(this.listeMissionTerminee);
    else if(statusCh == true)
        this.dataSource =  new MatTableDataSource<AcceuilMissionList>(this.listeMissionEnCours );
    else
        this.dataSource=  new MatTableDataSource<AcceuilMissionList>(this.listeMission);
    }


ngOnDestroy(): void {}

  }



