interface VehiculeParc{
    id           :number,
    immat     :number,
    categorie      :number,     
    marque          :string,
    couleur       :string,
    est_disponible       :boolean,
    poids_vide :number
  
  }
  
  export class VehiculeParcs implements VehiculeParc{
    id!: number;
    immat!: number;
    est_disponible!: boolean;
    marque : string;
    couleur : string;
    categorie : number;
    poids_vide! :number;
  }
  