import { TestBed } from '@angular/core/testing';

import { NotificationPushService } from './notification-push.service';

describe('NotificationPushService', () => {
  let service: NotificationPushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationPushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
