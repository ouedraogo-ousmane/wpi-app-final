interface Maintenance {
  id                        :number,
  exerciceConcerne          :Number,
  vehiculeConcerne          :Number,
  motif                     :String,
  montant                   :Number,
  date_maintenance          :Date,
  reference                  :FormData,
  vehiculeData :{id:number,immat:string},
  pieces_enregistrees :{nomPiece:{id:number,nom:string},coutUnitaire:number,nombre:number}[]
}

export class Maintenances implements Maintenance{
  id!: number;
  exerciceConcerne!: number;
  vehiculeConcerne!: number;
  motif!: string;
  montant!: number;
  date_maintenance! :Date;
  reference! : FormData;
  chauffeur! : Chauffeur;
  vehiculeData! :{id:number,immat:string};
  pieces_enregistrees! :{nomPiece:{id:number,nom:string},coutUnitaire:number,nombre:number}[];



}

export interface Chauffeur{
  nom : string,
  prenom : string
}
