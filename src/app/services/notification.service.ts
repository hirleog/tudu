import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

export interface PushActivationResult {
  success: boolean;
  message: string;
  subscription?: any;
  error?: any;
}
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
   * Ativa push notifications para o usuário logado (com .then())
   */
  async activatePush(): Promise<PushActivationResult> {
    return new Promise(async (resolve) => {
      try {
        console.log('🔔 Iniciando ativação de push notifications...');

        // 1. Obtém IDs do usuário
        const { clienteId, prestadorId } = await this.getUserIds();

        if (!clienteId && !prestadorId) {
          resolve({
            success: false,
            message: 'Nenhum usuário logado encontrado',
          });
          return;
        }

        console.log(
          `👤 IDs obtidos - Cliente: ${clienteId}, Prestador: ${prestadorId}`
        );

        // 2. Verifica se SwPush está habilitado
        if (!this.isPushEnabled()) {
          resolve({
            success: false,
            message: 'Push notifications não estão habilitados neste ambiente',
          });
          return;
        }

        console.log('📝 Solicitando subscription...');

        // 3. Cria subscription COM .then() (como funciona pra você)
        this.swPush
          .requestSubscription({
            serverPublicKey: this.vapidPublicKey,
          })
          .then(async (subscription) => {
            console.log('✅ Subscription criada:', subscription);

            try {
              // 4. Salva no backend
              await this.saveSubscriptionToServer(
                clienteId,
                prestadorId,
                subscription
              );

              resolve({
                success: true,
                message: 'Push notifications ativados com sucesso!',
                subscription,
              });
            } catch (saveError) {
              console.error('❌ Erro ao salvar subscription:', saveError);
              resolve({
                success: false,
                message: 'Erro ao salvar subscription no servidor',
                error: saveError,
              });
            }
          })
          .catch((subscriptionError) => {
            console.error('❌ Erro ao criar subscription:', subscriptionError);
            resolve({
              success: false,
              message: this.getErrorMessage(subscriptionError),
              error: subscriptionError,
            });
          });
      } catch (error) {
        console.error('❌ Erro geral ao ativar push notifications:', error);
        resolve({
          success: false,
          message: this.getErrorMessage(error),
          error,
        });
      }
    });
  }

  async activatePushSimple(): Promise<void> {
    try {
      const { clienteId, prestadorId } = await this.getUserIds();

      console.log('📍 1. Iniciando ativação de push');

      // ✅ Tentativa principal com swPush (usando string)
      try {
        return await this.activateWithSwPush(clienteId, prestadorId);
      } catch (swError) {
        console.warn('❌ SwPush falhou, tentando fallback...', swError);

        // ✅ Fallback para navegadores problemáticos
        return await this.activateWithFallback(clienteId, prestadorId);
      }
    } catch (error) {
      console.error('❌ Todas as tentativas falharam:', error);
      throw error;
    }
  }

  private async activateWithSwPush(
    clienteId: string,
    prestadorId: string
  ): Promise<void> {
    console.log('🔄 Tentando com SwPush...');

    if (!this.swPush.isEnabled) {
      throw new Error('SwPush não habilitado');
    }

    // ✅ Aguardar um pouco para garantir que o SW está pronto
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ✅ swPush.requestSubscription espera STRING, não Uint8Array
    const subscription = await this.swPush.requestSubscription({
      serverPublicKey: this.vapidPublicKey, // Já é string
    });

    await this.sendSubscriptionToBackend(clienteId, prestadorId, subscription);
    console.log('✅ Subscription com SwPush realizada!');
  }

  private urlBase64ToUint8Array(base64String: string): any {
    try {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      return outputArray;
    } catch (error) {
      console.error('❌ Erro ao converter chave VAPID:', error);
      throw new Error('Chave VAPID inválida');
    }
  }

  private async activateWithFallback(
    clienteId: string,
    prestadorId: string
  ): Promise<void> {
    console.log('🔄 Tentando método fallback manual...');

    try {
      // ✅ Registrar Service Worker manualmente se necessário
      let registration: ServiceWorkerRegistration;

      if (!navigator.serviceWorker?.controller) {
        console.log('📋 Registrando Service Worker manualmente...');
        registration = await navigator.serviceWorker.register(
          '/ngsw-worker.js'
        );

        // Aguardar o SW ficar ativo
        await new Promise<void>((resolve) => {
          if (registration.active) {
            resolve();
          } else {
            registration.addEventListener('activate', () => resolve());
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        registration = await navigator.serviceWorker.ready;
      }

      console.log('📋 Service Worker pronto, solicitando subscription...');

      // ✅ CORREÇÃO: Criar Uint8Array corretamente
      const applicationServerKey = this.urlBase64ToUint8Array(
        this.vapidPublicKey
      );

      // ✅ Usar a API diretamente do Service Worker
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      console.log('✅ Subscription criada via fallback');
      await this.sendSubscriptionToBackend(
        clienteId,
        prestadorId,
        subscription
      );
      console.log('✅ Subscription com fallback realizada!');
    } catch (error) {
      console.error('❌ Fallback também falhou:', error);
      throw new Error(`Não foi possível ativar notificações: `);
    }
  }
  private async sendSubscriptionToBackend(
    clienteId: string,
    prestadorId: string,
    subscription: any
  ) {
    console.log('📤 Enviando subscription para backend...');

    const subData = subscription.toJSON ? subscription.toJSON() : subscription;

    await this.http
      .post(`${environment.apiUrl}/notifications/subscribe`, {
        clienteId,
        prestadorId,
        subscription: subData,
      })
      .toPromise();

    console.log('✅ Subscription salva no backend!');
  }

  /**
   * Solicita permissão e ativa push de forma segura
   */
  async requestPermissionAndActivate(): Promise<PushActivationResult> {
    // Primeiro verifica permissão
    if (Notification.permission === 'denied') {
      return {
        success: false,
        message: 'Permissão para notificações foi negada anteriormente',
      };
    }

    if (Notification.permission === 'granted') {
      // Já tem permissão, apenas ativa
      return await this.activatePush();
    }

    // Solicita permissão
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      return await this.activatePush();
    } else {
      return {
        success: false,
        message: `Permissão ${permission} pelo usuário`,
      };
    }
  }

  /**
   * Verifica se as push notifications estão disponíveis
   */
  isPushAvailable(): boolean {
    return (
      this.swPush.isEnabled &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  // ========== MÉTODOS PRIVADOS ==========

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
