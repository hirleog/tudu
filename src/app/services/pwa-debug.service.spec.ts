import { TestBed } from '@angular/core/testing';

import { PwaDebugService } from './pwa-debug.service';

describe('PwaDebugService', () => {
  let service: PwaDebugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaDebugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
