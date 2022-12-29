import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-chauffeur',
  templateUrl: './detail-chauffeur.component.html',
  styleUrls: ['./detail-chauffeur.component.css']
})
export class DetailChauffeurComponent implements OnInit {
  // Declaration des variables
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  constructor() { }

  ngOnInit(): void {
  }

}
