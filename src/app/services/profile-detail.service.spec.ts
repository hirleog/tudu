import { TestBed } from '@angular/core/testing';

import { ProfileDetailService } from './profile-detail.service';

describe('ProfileDetailService', () => {
  let service: ProfileDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
