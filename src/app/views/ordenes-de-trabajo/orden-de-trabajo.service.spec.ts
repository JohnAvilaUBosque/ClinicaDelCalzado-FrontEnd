import { TestBed } from '@angular/core/testing';

import { OrdenDeTrabajoService } from './orden-de-trabajo.service';

describe('OrdenDeTrabajoService', () => {
  let service: OrdenDeTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenDeTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
