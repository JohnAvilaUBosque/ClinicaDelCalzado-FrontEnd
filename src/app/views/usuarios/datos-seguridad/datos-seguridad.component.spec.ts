import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosSeguridadComponent } from './datos-seguridad.component';

describe('DatosSeguridadComponent', () => {
  let component: DatosSeguridadComponent;
  let fixture: ComponentFixture<DatosSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosSeguridadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
