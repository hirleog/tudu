import { TestBed } from '@angular/core/testing';
import { GoogleReviewsService } from './google-reviews.service';

describe('GoogleReviewsService', () => {
  let service: GoogleReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
