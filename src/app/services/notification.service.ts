import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private API_URL = 'https://seu-backend.com/subscriptions';

  constructor(private http: HttpClient) {}

  sendSubscriptionToServer(subscription: PushSubscription) {
    return this.http.post(`${this.API_URL}`, {
      subscription: subscription.toJSON(),
    });
  }
}
