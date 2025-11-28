// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Notification {
  id: number;
  title: string;
  body: string;
  icon?: string;
  id_pedido?: string;
  read: boolean;
  createdAt: string;
  metadata?: string;
  clienteId?: number;
  prestadorId?: number;
  imagens: string[];
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationViewService {
  private apiUrl = `${environment.apiUrl}/notifications/list`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private readNotifications = new Set<number>();
  private currentClienteId?: string;
  private currentPrestadorId?: string;
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  // Método para configurar o usuário atual
  setCurrentUser(clienteId?: string, prestadorId?: string): void {
    this.currentClienteId = clienteId;
    this.currentPrestadorId = prestadorId;
    console.log('Usuário configurado:', { clienteId, prestadorId });

    // CARREGA O CONTADOR APÓS CONFIGURAR O USUÁRIO
    this.loadUnreadCount(true); // força recarregar
  }

  getNotifications(
    page: number = 1,
    limit: number = 20,
    clienteId?: string,
    prestadorId?: string,
    forceRefresh: boolean = false
  ): Observable<NotificationsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('_t', Date.now().toString()); // ✅ FORÇA CACHE BUSTING

    // Usa os IDs passados ou os configurados
    const finalClienteId = clienteId || this.currentClienteId;
    const finalPrestadorId = prestadorId || this.currentPrestadorId;

    if (finalClienteId) {
      params = params.set('clienteId', finalClienteId);
    }

    if (finalPrestadorId) {
      params = params.set('prestadorId', finalPrestadorId);
    }

    console.log('📨 Buscando notificações com cache busting');

    return this.http.get<NotificationsResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        response.notifications = this.groupNotificationsByDate(
          response.notifications
        );
        this.lastLoadTime = Date.now();
        return response;
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        this.readNotifications.add(notificationId);
        this.decrementUnreadCount();
        // ✅ FORÇA ATUALIZAÇÃO DO CONTADOR APÓS MARCAR COMO LIDA
        setTimeout(() => this.loadUnreadCount(true), 500);
      })
    );
  }

  markAllAsRead(clienteId?: string, prestadorId?: string): Observable<any> {
    const body: any = {};

    if (clienteId) body.clienteId = Number(clienteId);
    if (prestadorId) body.prestadorId = Number(prestadorId);

    return this.http.post(`${this.apiUrl}/mark-all-read`, body).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
        // ✅ FORÇA RECARREGAR O CONTADOR
        setTimeout(() => this.loadUnreadCount(true), 500);
      })
    );
  }

  loadUnreadCount(force: boolean = false): void {
    // ✅ VERIFICA CACHE - só recarrega se for forçado ou passou o tempo
    const now = Date.now();
    if (!force && now - this.lastLoadTime < this.CACHE_DURATION) {
      console.log('♻️ Usando cache do contador');
      return;
    }

    // Só carrega se tiver um usuário configurado
    if (!this.currentClienteId && !this.currentPrestadorId) {
      console.log('⏳ Aguardando configuração do usuário...');
      return;
    }

    let params = new HttpParams().set('_t', now.toString()); // ✅ CACHE BUSTING

    if (this.currentClienteId) {
      params = params.set('clienteId', this.currentClienteId);
    }

    if (this.currentPrestadorId) {
      params = params.set('prestadorId', this.currentPrestadorId);
    }

    console.log('🔄 Carregando contador com cache busting');

    this.http
      .get<{ count: number }>(`${this.apiUrl}/count/unread`, { params })
      .subscribe({
        next: (response) => {
          console.log('✅ Contador de não lidas do servidor:', response.count);
          this.unreadCountSubject.next(response.count);
          this.lastLoadTime = now;
        },
        error: (err) => {
          console.error('❌ Erro ao carregar contador de não lidas:', err);
        },
      });
  }

  // ✅ NOVO MÉTODO: Força atualização completa
  forceRefresh(): void {
    console.log('🔄 Forçando atualização completa das notificações');
    this.lastLoadTime = 0;
    this.loadUnreadCount(true);
  }

  // ✅ NOVO MÉTODO: Verifica se precisa atualizar
  shouldRefresh(): boolean {
    return Date.now() - this.lastLoadTime > this.CACHE_DURATION;
  }

  getUnreadNotifications(
    clienteId?: string,
    prestadorId?: string
  ): Observable<Notification[]> {
    let params = new HttpParams().set('_t', Date.now().toString()); // ✅ CACHE BUSTING

    if (clienteId) params = params.set('clienteId', clienteId);
    if (prestadorId) params = params.set('prestadorId', prestadorId);

    return this.http
      .get<Notification[]>(`${this.apiUrl}/unread`, { params })
      .pipe(
        map((notifications) => this.groupNotificationsByDate(notifications))
      );
  }

  markAsViewedLocally(notificationId: number): void {
    if (!this.readNotifications.has(notificationId)) {
      this.readNotifications.add(notificationId);
      this.decrementUnreadCount();
    }
  }

  isNotificationRead(notificationId: number): boolean {
    return this.readNotifications.has(notificationId);
  }

  clearReadCache(): void {
    this.readNotifications.clear();
  }

  private groupNotificationsByDate(
    notifications: Notification[]
  ): Notification[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return notifications.map((notification) => {
      const notificationDate = new Date(notification.createdAt);

      return {
        ...notification,
        read: notification.read || this.readNotifications.has(notification.id),
        _groupDate: this.getGroupDateLabel(notificationDate, today, yesterday),
      };
    });
  }

  private getGroupDateLabel(
    notificationDate: Date,
    today: Date,
    yesterday: Date
  ): string {
    if (this.isSameDay(notificationDate, today)) {
      return 'Hoje';
    } else if (this.isSameDay(notificationDate, yesterday)) {
      return 'Ontem';
    } else {
      return this.formatDate(notificationDate);
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  decrementUnreadCount(): void {
    const currentCount = this.unreadCountSubject.value;
    if (currentCount > 0) {
      this.unreadCountSubject.next(currentCount - 1);
      console.log('➖ Contador decrementado para:', currentCount - 1);
    }
  }

  private incrementUnreadCount(): void {
    const currentCount = this.unreadCountSubject.value;
    this.unreadCountSubject.next(currentCount + 1);
  }
}
