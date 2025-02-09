import { TestBed } from '@angular/core/testing';

import { PaymentIntegrationService } from './payment-integration.service';

describe('PaymentIntegrationService', () => {
  let service: PaymentIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
