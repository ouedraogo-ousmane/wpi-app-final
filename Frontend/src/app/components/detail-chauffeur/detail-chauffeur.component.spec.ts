import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChauffeurComponent } from './detail-chauffeur.component';

describe('DetailChauffeurComponent', () => {
  let component: DetailChauffeurComponent;
  let fixture: ComponentFixture<DetailChauffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailChauffeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailChauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
