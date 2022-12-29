interface Chauffeur{
    id           :number,
    vehicule     :number,
    salaire      :number,     
    nom          :string,
    prenom       :string,
    telephone       :string,
    vehiculeInfos   :{id:number,immat:string,categorie:number,couleur:string,est_disponible:boolean,marque:string,poids_vide:number}
  
  }
  
  export class Chauffeurs implements Chauffeur{
    id!: number;
    vehicule!: number;
    salaire!: number;
    nom : string;
    prenom : string;
    telephone : string;
    vehiculeInfos! : {id:number,immat:string,categorie:number,couleur:string,est_disponible:boolean,marque:string,poids_vide:number};
  }
  