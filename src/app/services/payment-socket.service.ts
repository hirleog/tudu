import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      path: '/socket.io', // garante que Nginx roteie corretamente
      transports: ['websocket'],
      secure: true,
      withCredentials: true,
    });
  }

  ouvirStatusPagamento(orderReferenceId: string): Observable<any> {
    // 1. Entra na "sala" específica daquele pedido/referência
    this.socket.emit('joinOrderRoom', orderReferenceId); // <--- Você precisa de um listener no backend para isso!

    // 2. Retorna um Observable que escuta o evento de sucesso
    return new Observable((observer) => {
      // O nome do evento deve ser o mesmo que o Backend EMITIRÁ
      this.socket.on('paymentStatus', (data) => {
        observer.next(data);
      });
    });
  }
}
