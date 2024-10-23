import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDeUsuarioComponent } from './manual-de-usuario.component';

describe('ManualDeUsuarioComponent', () => {
  let component: ManualDeUsuarioComponent;
  let fixture: ComponentFixture<ManualDeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualDeUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualDeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
