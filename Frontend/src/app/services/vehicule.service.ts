import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehiculesDuParc } from '../folderModels/modelGestMission/vehicule-du-parc';
import { Categories } from '../components/chauffeur/categorie';
import { VehiculeParcs } from '../components/chauffeur/vehiculeParc';
import { VehiculeDocs } from '../components/chauffeur/vehiculeDocs';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  /**
   * Declaration des urls
   */

  urlvehicule = 'http://127.0.0.1:8000/missions/vehiculeParcs/';
  urlvehiculeDocs = 'http://127.0.0.1:8000/missions/docsVehicules/';
  urlcategorie = 'http://127.0.0.1:8000/missions/categories/';
  urlchauffeur = 'http://127.0.0.1:8000/missions/chauffeurs/';

  httpOptions = {};
  public token : any;

  constructor(private http:HttpClient) {
    this.token = localStorage.getItem("token")
    console.log(this.token)
    this.httpOptions = {
       headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "WEND-PANGA " + this.token
        }) 
    }
  }

   /**
    * Cette methode ci-dessous permet de recuperer toutes les vehicules
    */

    
  getVehicules():Observable<VehiculesDuParc[]>{
    this.httpOptions = {
      method:'GET',
      headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': "WEND-PANGA " + this.token
       }) 
   }

    return this.http.get<VehiculesDuParc[]>(this.urlvehicule ,this.httpOptions);
  }


  getCategorie():Observable<Categories[]>{
    this.httpOptions = {
      method:'GET',
      headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': "WEND-PANGA " + this.token
       }) 
   }

    return this.http.get<Categories[]>(this.urlcategorie ,this.httpOptions);
  }

   /**
   * Methode d'envoie ,de modification et de suppression d'un vehicule
   */

    sendOrDeleteVehicule(data:VehiculeParcs,method:string="post"):Observable<VehiculeParcs>{

      if(method==="post"){
         
       
        return this.http.post<VehiculeParcs>(this.urlvehicule,data,this.httpOptions);
      }
      else if(method==="put"){
        
       
        return this.http.put<VehiculeParcs>(this.urlvehicule + `${data.id}/detail/`,data,this.httpOptions);
      }
      
  
      return this.http.delete<VehiculeParcs>(this.urlvehicule + `${data.id}/detail/`,this.httpOptions);
  
    }

    /**
   * Methode d'envoie ,de modification et de suppression d'un document vehicule
   */

     sendOrDeleteVehiculeDoc(data:VehiculeDocs,method:string="post"):Observable<VehiculeDocs>{

      if(method==="post"){
         
       
        return this.http.post<VehiculeDocs>(this.urlvehiculeDocs,data,this.httpOptions);
      }
      else if(method==="put"){
        
       
        return this.http.put<VehiculeDocs>(this.urlvehiculeDocs + `${data.id}/detail/`,data,this.httpOptions);
      }
      
  
      return this.http.delete<VehiculeDocs>(this.urlvehiculeDocs + `${data.id}/detail/`,this.httpOptions);
  
    }
}
