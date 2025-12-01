// src/app/components/notifications/notification-view.component.ts
import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import {
  Notification,
  NotificationViewService,
} from 'src/app/services/notification-view.service';

interface GroupedNotifications {
  [key: string]: Notification[];
}

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css'],
})
export class NotificationViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private autoRefreshSubscription?: Subscription;

  // ✅ PROPRIEDADES DO USUÁRIO
  isCliente: boolean = false;
  isPrestador: boolean = false;
  userId: string | null = null;
  userType: 'cliente' | 'prestador' | null = null;

  // ✅ PROPRIEDADES DAS NOTIFICAÇÕES
  notifications: Notification[] = [];
  groupedNotifications: GroupedNotifications = {};
  loading = false;
  hasMore = true;
  currentPage = 1;
  limit = 20;

  constructor(
    private notificationViewService: NotificationViewService,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.setupUserAuthentication();
    this.loadNotifications();
    this.startAutoRefresh();

    // Debug do contador
    this.notificationViewService.unreadCount$.subscribe((count) => {
      console.log('🔔 Contador no componente:', count);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoRefresh();
  }

  // ✅ CONFIGURAÇÃO DO USUÁRIO AUTENTICADO
  private setupUserAuthentication(): void {
    // Observa mudanças no status de autenticação
    this.authService.isClienteLoggedIn$.subscribe((isCliente) => {
      this.isCliente = isCliente;
      if (isCliente) {
        this.userType = 'cliente';
      }
    });

    this.authService.isPrestadorLoggedIn$.subscribe((isPrestador) => {
      this.isPrestador = isPrestador;
      if (isPrestador) {
        this.userType = 'prestador';
      }
    });

    // Observa mudanças nos IDs
    this.authService.idCliente$.subscribe((id) => {
      if (id && this.isCliente) {
        this.userId = id;
        console.log('👤 Cliente configurado:', id);
        this.notificationViewService.setCurrentUser(id, undefined);
      }
    });

    this.authService.idPrestador$.subscribe((id) => {
      if (id && this.isPrestador) {
        this.userId = id;
        console.log('👷 Prestador configurado:', id);
        this.notificationViewService.setCurrentUser(undefined, id);
      }
    });
  }

  // ✅ CARREGA NOTIFICAÇÕES COM BASE NO TIPO DE USUÁRIO
  loadNotifications(
    loadMore: boolean = false,
    forceRefresh: boolean = false
  ): void {
    if (this.loading) return;

    this.loading = true;

    if (!loadMore || forceRefresh) {
      this.currentPage = 1;
      this.notifications = [];
    }

    // ✅ DETERMINA OS PARÂMETROS BASEADO NO TIPO DE USUÁRIO
    let idCliente: string | undefined;
    let idPrestador: string | undefined;

    if (this.isCliente && this.userId) {
      idCliente = this.userId;
      console.log('📨 Carregando notificações do CLIENTE:', idCliente);
    } else if (this.isPrestador && this.userId) {
      idPrestador = this.userId;
      console.log('📨 Carregando notificações do PRESTADOR:', idPrestador);
    } else {
      console.warn('⚠️ Usuário não autenticado ou sem ID');
      this.loading = false;
      return;
    }

    this.notificationViewService
      .getNotifications(
        this.currentPage,
        this.limit,
        idCliente,
        idPrestador,
        forceRefresh
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (loadMore && !forceRefresh) {
            this.notifications = [
              ...this.notifications,
              ...response.notifications,
            ];
          } else {
            this.notifications = response.notifications;
          }

          this.groupNotifications();
          this.hasMore = response.hasMore;
          this.currentPage++;
          this.loading = false;

          console.log('✅ Notificações carregadas:', this.notifications.length);
          console.log('👤 Tipo de usuário:', this.userType);
        },
        error: (err) => {
          console.error('❌ Erro ao carregar notificações:', err);
          this.loading = false;
        },
      });
  }

  // ✅ NAVEGAÇÃO INTELIGENTE BASEADA NO TIPO DE USUÁRIO
  navigateToNotification(notification: any): void {
    const statusLowerCase = notification.status?.toLowerCase() || '';

    this.markAsRead(notification);

    if (!notification.id_pedido) {
      console.warn('⚠️ Notificação sem id_pedido');
      const fallbackRoute = this.isPrestador
        ? '/tudu-professional/home'
        : '/home';
      this.router.navigate([fallbackRoute]);
      return;
    }

    if (this.isPrestador) {
      // ✅ PRESTADOR: Lógica baseada no STATUS
      switch (statusLowerCase) {
        case 'new_card':
          console.log('🎯 Prestador - Novo pedido disponível');
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'publicado',
            },
          });
          break;

        case 'provider_hired':
          console.log('🚀 Prestador - Foi contratado');
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'progress',
            },
          });
          break;

        case 'service_completed':
          console.log('✅ Prestador - Serviço finalizado');
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'historic',
            },
          });
          break;

        case 'candidature_rejected':
          console.log('Adicionar pop-up de serviço já finalizado');

          break;

        case 'card_cancelled':
          console.log('❌ Prestador - Card cancelado');
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'historic',
            },
          });
          break;

        case 'contract_cancelled':
          console.log('❌ Prestador - Contrato cancelado');
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'historic',
            },
          });
          break;

        case 'candidature_cancelled':
          this.router.navigate(['home/detail'], {
            queryParams: {
              param: 'professional',
              id: notification.id_pedido,
              flow: 'historic',
            },
          });
          break;

        default:
          break;
      }
    } else {
      // ✅ CLIENTE: Lógica baseada no STATUS
      switch (status) {
        case 'new_candidature':
          console.log('📨 Cliente - Nova candidatura');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'publicado',
            },
          });
          break;

        case 'candidature_updated':
          console.log('📝 Cliente - Candidatura atualizada');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'publicado',
            },
          });
          break;

        case 'hire_confirmed':
          console.log('🎉 Cliente - Contratação confirmada');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'andamento',
            },
          });
          break;

        case 'service_completed':
          console.log('✅ Cliente - Serviço concluído');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'finalizado',
            },
          });
          break;

        case 'candidature_cancelled':
          console.log('📝 Cliente - Candidatura cancelada pelo prestador');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'publicado',
            },
          });
          break;

        case 'card_cancelled':
          console.log('❌ Cliente - Card cancelado');
          this.router.navigate(['/home']);
          break;

        case 'new_card':
          console.log('🎯 Cliente - Novo card criado (próprio)');
          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: 'publicado',
            },
          });
          break;

        default:
          // Fallback para notificações sem status (compatibilidade)
          console.log(
            '🔍 Cliente - Status não mapeado, usando fallback por título'
          );
          let flow = 'publicado';

          // if (
          //   statusTitle.includes('atualizada') ||
          //   statusTitle.includes('nova')
          // ) {
          //   flow = 'publicado';
          // } else if (statusTitle.includes('confirmada')) {
          //   flow = 'andamento';
          // } else if (
          //   statusTitle.includes('finalizado') ||
          //   statusTitle.includes('concluído')
          // ) {
          //   flow = 'finalizado';
          // }

          this.router.navigate(['/home/budgets'], {
            queryParams: {
              id: notification.id_pedido,
              flow: flow,
            },
          });
          console.log('👤 Cliente - Flow determinado por título:', flow);
      }
    }
  }
  // ✅ MARCA TODAS COMO LIDAS COM O ID CORRETO
  markAllAsRead(): void {
    let idCliente: string | undefined;
    let idPrestador: string | undefined;

    if (this.isCliente && this.userId) {
      idCliente = this.userId;
    } else if (this.isPrestador && this.userId) {
      idPrestador = this.userId;
    }

    console.log('🗑️ Marcando todas como lidas para:', {
      userType: this.userType,
      userId: this.userId,
    });

    this.notificationViewService
      .markAllAsRead(idCliente, idPrestador)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications.forEach(
            (notification) => (notification.read = true)
          );
          console.log('✅ Todas as notificações marcadas como lidas');
        },
        error: (err) => {
          console.error('❌ Erro ao marcar todas como lidas:', err);
        },
      });
  }

  // ✅ MÉTODOS AUXILIARES (mantidos da versão anterior)
  private startAutoRefresh(): void {
    this.autoRefreshSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.notificationViewService.shouldRefresh()) {
          console.log('🔄 Auto-refresh das notificações');
          this.loadNotifications(true);
          this.notificationViewService.loadUnreadCount(true);
        }
      });
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  @HostListener('window:focus')
  onWindowFocus() {
    console.log('👀 Página em foco - atualizando notificações');
    this.notificationViewService.forceRefresh();
  }

  @HostListener('window:visibilitychange')
  onVisibilityChange() {
    if (!document.hidden) {
      console.log('📱 Página visível - atualizando notificações');
      this.notificationViewService.forceRefresh();
    }
  }

  groupNotifications(): void {
    this.groupedNotifications = {};

    this.notifications.forEach((notification) => {
      const groupKey = (notification as any)._groupDate;
      if (!this.groupedNotifications[groupKey]) {
        this.groupedNotifications[groupKey] = [];
      }
      this.groupedNotifications[groupKey].push(notification);
    });
  }

  markAsRead(notification: Notification, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!notification.read) {
      this.notificationViewService
        .markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('✅ Notificação marcada como lida');
            notification.read = true;
            this.notificationViewService.decrementUnreadCount();
          },
          error: (err) => {
            console.error('❌ Erro ao marcar como lida:', err);
          },
        });
    }
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadNotifications(true);
    }
  }

  forceRefresh(): void {
    console.log('🔄 Forçando refresh manual');
    this.loadNotifications(false, true);
    this.notificationViewService.forceRefresh();
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  trackByGroupDate(index: number, group: any): string {
    return group.key;
  }

  getGroupedNotificationsArray(): {
    key: string;
    notifications: Notification[];
  }[] {
    return Object.keys(this.groupedNotifications).map((key) => ({
      key,
      notifications: this.groupedNotifications[key],
    }));
  }

  goBack(): void {
    this.location.back();
  }

  // ✅ MÉTODO PARA DEBUG (opcional)
  getUserInfo(): string {
    if (this.isCliente) return `Cliente: ${this.userId}`;
    if (this.isPrestador) return `Prestador: ${this.userId}`;
    return 'Usuário não autenticado';
  }
}
