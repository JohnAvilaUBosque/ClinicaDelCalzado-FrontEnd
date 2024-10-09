import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoOperariosComponent } from './listado-operarios.component';

describe('ListadoOperariosComponent', () => {
  let component: ListadoOperariosComponent;
  let fixture: ComponentFixture<ListadoOperariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoOperariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoOperariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
