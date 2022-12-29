interface VehiculeDoc{
    id           :number,
    vehicule           :number,
    intitule       :string,
    date_expiration : Date
  
  }
  
  export class VehiculeDocs implements VehiculeDoc{
    id!: number;
    vehicule!: number;
    intitule! : string;
    date_expiration! : Date;

  }
  