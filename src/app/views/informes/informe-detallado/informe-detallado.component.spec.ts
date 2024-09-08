import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeDetalladoComponent } from './informe-detallado.component';

describe('InformeDetalladoComponent', () => {
  let component: InformeDetalladoComponent;
  let fixture: ComponentFixture<InformeDetalladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeDetalladoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeDetalladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
