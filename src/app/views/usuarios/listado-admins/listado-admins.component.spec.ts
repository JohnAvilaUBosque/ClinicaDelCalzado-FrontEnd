import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAdminsComponent } from './listado-admins.component';

describe('ListadoAdminsComponent', () => {
  let component: ListadoAdminsComponent;
  let fixture: ComponentFixture<ListadoAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAdminsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
