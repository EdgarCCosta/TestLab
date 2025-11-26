import { TestBed } from '@angular/core/testing';

import { Ejecucion } from './ejecucion';

describe('Ejecucion', () => {
  let service: Ejecucion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ejecucion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
