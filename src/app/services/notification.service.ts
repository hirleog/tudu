import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  sendSubscriptionToServer(subscription: PushSubscription) {
    return this.http.post(`${environment.apiUrl}/notifications`, {
      subscription: subscription.toJSON(),
    });
  }
}
