import { TestBed } from '@angular/core/testing';

import { PaymentSocketService } from './payment-socket.service';

describe('PaymentSocketService', () => {
  let service: PaymentSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
