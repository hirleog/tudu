import { TestBed } from '@angular/core/testing';

import { PagbankService } from './pagbank.service';

describe('PagbankService', () => {
  let service: PagbankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagbankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
