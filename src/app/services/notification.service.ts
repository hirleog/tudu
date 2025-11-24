import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly vapidPublicKey =
    'BETOn-pGBaW59qF-RFin_fUGfJmZshZFIg2KynwJUDfCEg5mon6iRE6hdPTxplYV5lCKWuupLAGz56V9OSecgA4';

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private authService: AuthService
  ) {}

  sendSubscriptionToServer(
    clienteId: any,
    prestadorId: any,
    subscription: any
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

  /**
   * Ativa push notifications para o usuário logado
   */
  async activatePush(): Promise<any> {
    try {
      console.log('🔔 Iniciando ativação de push notifications...');

      // 1. Obtém IDs do usuário
      const { clienteId, prestadorId } = await this.getUserIds();

      if (!clienteId && !prestadorId) {
        return {
          success: false,
          message: 'Nenhum usuário logado encontrado',
        };
      }

      console.log(
        `👤 IDs obtidos - Cliente: ${clienteId}, Prestador: ${prestadorId}`
      );

      // 2. Verifica se SwPush está habilitado
      if (!this.isPushEnabled()) {
        return {
          success: false,
          message: 'Push notifications não estão habilitados neste ambiente',
        };
      }

      // 3. Cria subscription
      const subscription = await this.createSubscription();

      // 4. Salva no backend
      await this.saveSubscriptionToServer(clienteId, prestadorId, subscription);

      return {
        success: true,
        message: 'Push notifications ativados com sucesso!',
        subscription,
      };
    } catch (error) {
      console.error('❌ Erro ao ativar push notifications:', error);

      return {
        success: false,
        message: this.getErrorMessage(error),
        error,
      };
    }
  }

  private async getUserIds(): Promise<{ clienteId: any; prestadorId: any }> {
    let clienteId: any = null;
    let prestadorId: any = null;

    if (this.authService.isClienteLoggedIn()) {
      clienteId = await firstValueFrom(this.authService.idCliente$);
    } else if (this.authService.isPrestadorLoggedIn()) {
      prestadorId = await firstValueFrom(this.authService.idPrestador$);
    }

    return { clienteId, prestadorId };
  }

  private isPushEnabled(): boolean {
    if (!this.swPush.isEnabled) {
      console.warn('❌ SwPush não está habilitado');
      return false;
    }
    return true;
  }

  private async createSubscription(): Promise<PushSubscription> {
    console.log('📝 Solicitando subscription...');

    const subscription = await this.swPush.requestSubscription({
      serverPublicKey: this.vapidPublicKey,
    });

    console.log('✅ Subscription criada com sucesso');
    return subscription;
  }

  private async saveSubscriptionToServer(
    clienteId: any,
    prestadorId: any,
    subscription: PushSubscription
  ): Promise<void> {
    console.log('💾 Salvando subscription no servidor...');

    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/notifications/subscribe`, {
        clienteId,
        prestadorId,
        subscription: subscription.toJSON(),
      })
    );

    console.log('✅ Subscription salva no servidor!');
  }

  private getErrorMessage(error: any): string {
    if (error?.message?.includes('permission')) {
      return 'Permissão para notificações não concedida';
    }
    if (error?.message?.includes('VAPID')) {
      return 'Chave VAPID inválida';
    }
    if (error?.status === 0) {
      return 'Erro de conexão com o servidor';
    }
    return error?.message || 'Erro desconhecido ao ativar notificações';
  }
}
