import { TestBed } from '@angular/core/testing';

import { PriceEstimationService } from './price-estimation.service';

describe('PriceEstimationService', () => {
  let service: PriceEstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceEstimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
