import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicules',
  templateUrl: './vehicules.component.html',
  styleUrls: ['./vehicules.component.css']
})
export class VehiculesComponent implements OnInit {

  isLoaded : boolean = true;
  displayCar : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
