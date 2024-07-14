import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeEspecificoComponent } from './informe-especifico.component';

describe('InformeEspecificoComponent', () => {
  let component: InformeEspecificoComponent;
  let fixture: ComponentFixture<InformeEspecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeEspecificoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeEspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
