import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeGeneralComponent } from './informe-general.component';

describe('InformeGeneralComponent', () => {
  let component: InformeGeneralComponent;
  let fixture: ComponentFixture<InformeGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
