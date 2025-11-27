import { TestBed } from '@angular/core/testing';

import { NotificationViewService } from './notification-view.service';

describe('NotificationViewService', () => {
  let service: NotificationViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
