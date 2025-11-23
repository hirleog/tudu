import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly vapidPublicKey =
    'BETOn-pGBaW59qF-RFin_fUGfJmZshZFIg2KynwJUDfCEg5mon6iRE6hdPTxplYV5lCKWuupLAGz56V9OSecgA4';

  constructor(private http: HttpClient) {}

  sendSubscriptionToServer(
    clienteId: number | 0,
    prestadorId: number | 0,
    subscription: any,
  ) {
    return this.http.post(`${environment.apiUrl}/notifications/subscribe`, {
      clienteId,
      prestadorId,
      subscription,
    });
  }

  /** Testa o push chamando notifications/test/clienteId/prestadorId */
  sendTest(clienteId: number, prestadorId: number) {
    return this.http.post(`${environment.apiUrl}/notifications/test`, {});
  }

  async requestPushSubscription(clienteId?: number, prestadorId?: number) {
    const sw = await navigator.serviceWorker.ready;

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.vapidPublicKey,
    });

    return this.http.post('/notifications/subscribe', {
      subscription,
      clienteId: clienteId || null,
      prestadorId: prestadorId || null,
    });
  }
}
