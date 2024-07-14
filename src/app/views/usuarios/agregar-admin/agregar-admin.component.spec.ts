import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAdminComponent } from './agregar-admin.component';

describe('AgregarAdminComponent', () => {
  let component: AgregarAdminComponent;
  let fixture: ComponentFixture<AgregarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
