import { TestBed } from '@angular/core/testing';

import { MalgaService } from './malga.service';

describe('MalgaService', () => {
  let service: MalgaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MalgaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
