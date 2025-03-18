import { TestBed } from '@angular/core/testing';

import { LoadMfeService } from './load-mfe.service';

describe('LoadMfeService', () => {
  let service: LoadMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
