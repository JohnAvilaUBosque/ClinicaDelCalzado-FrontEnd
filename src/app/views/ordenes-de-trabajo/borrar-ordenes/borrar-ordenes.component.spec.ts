import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrarOrdenesComponent } from './borrar-ordenes.component';

describe('BorrarOrdenesComponent', () => {
  let component: BorrarOrdenesComponent;
  let fixture: ComponentFixture<BorrarOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrarOrdenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorrarOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
