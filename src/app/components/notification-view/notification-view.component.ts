// src/app/components/notifications/notification-view.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  private subscriptionCliente: Subscription = new Subscription();
  private subscriptionPrestador: Subscription = new Subscription();

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;
  id_cliente!: string | null;
  prestadorId!: string | null;

  notifications: Notification[] = [];
  groupedNotifications: GroupedNotifications = {};
  loading = false;
  hasMore = true;
  currentPage = 1;
  limit = 20;

  private destroy$ = new Subject<void>();
  private autoRefreshSubscription?: Subscription;

  constructor(
    private notificationViewService: NotificationViewService,
    private router: Router,
    public authService: AuthService
  ) {
    this.subscriptionPrestador.add(
      this.authService.isPrestadorLoggedIn$.subscribe((loggedIn) => {
        this.prestadorIsLogged = loggedIn;
      })
    );
    this.subscriptionCliente.add(
      this.authService.isClienteLoggedIn$.subscribe((loggedIn) => {
        this.clienteIsLogged = loggedIn;
      })
    );

    this.authService.idCliente$.subscribe((id) => {
      this.id_cliente = id;
      if (id) {
        this.notificationViewService.setCurrentUser(id, undefined);
      }
    });

    this.authService.idPrestador$.subscribe((id) => {
      this.prestadorId = id;
      if (id) {
        this.notificationViewService.setCurrentUser(undefined, id);
      }
    });
  }

  ngOnInit(): void {
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
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
    this.stopAutoRefresh();
  }

  // ✅ AUTO-REFRESH A CADA 30 SEGUNDOS
  private startAutoRefresh(): void {
    this.autoRefreshSubscription = interval(30000) // 30 segundos
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.notificationViewService.shouldRefresh()) {
          console.log('🔄 Auto-refresh das notificações');
          this.loadNotifications(true); // força refresh
          this.notificationViewService.loadUnreadCount(true);
        }
      });
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  // ✅ ATUALIZA QUANDO A PÁGINA FICA VISÍVEL
  @HostListener('window:focus')
  onWindowFocus() {
    console.log('👀 Página em foco - atualizando notificações');
    this.notificationViewService.forceRefresh();
  }

  // ✅ ATUALIZA QUANDO O USUÁRIO VOLTA PARA A PÁGINA
  @HostListener('window:visibilitychange')
  onVisibilityChange() {
    if (!document.hidden) {
      console.log('📱 Página visível - atualizando notificações');
      this.notificationViewService.forceRefresh();
    }
  }

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

    const idCliente =
      this.clienteIsLogged && this.id_cliente ? this.id_cliente : undefined;
    const idPrestador =
      this.prestadorIsLogged && this.prestadorId ? this.prestadorId : undefined;

    console.log('📨 Carregando notificações para:', { idCliente, idPrestador });

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
        },
        error: (err) => {
          console.error('❌ Erro ao carregar notificações:', err);
          this.loading = false;
        },
      });
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

    console.log('🖱️ Tentando marcar como lida:', notification.id);

    if (!notification.read) {
      this.notificationViewService
        .markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('✅ Sucesso - notificação marcada como lida');
            notification.read = true;
            this.notificationViewService.decrementUnreadCount();
          },
          error: (err) => {
            console.error('❌ Erro ao marcar como lida:', err);
          },
        });
    } else {
      console.log('ℹ️ Notificação já estava lida');
    }
  }

  markAllAsRead(): void {
    const idCliente =
      this.clienteIsLogged && this.id_cliente ? this.id_cliente : undefined;
    const idPrestador =
      this.prestadorIsLogged && this.prestadorId ? this.prestadorId : undefined;

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

  navigateToNotification(notification: Notification): void {
    console.log(
      '🔗 Clicou na notificação:',
      notification.id,
      'Lida?',
      notification.read
    );

    this.markAsRead(notification);

    console.log('📝 Após markAsRead - Lida?', notification.read);

    if (notification.url) {
      this.router.navigate([notification.url]);
    }
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadNotifications(true);
    }
  }

  // ✅ NOVO MÉTODO: Força refresh manual
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
}
