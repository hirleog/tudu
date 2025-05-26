import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      transports: ['websocket'], // força WebSocket (opcional)
      // secure: environment.production, // só força HTTPS em produção
    });
  }
  ouvirAtualizacaoPedido(): Observable<any> {
    console.log('lalallalalalalalalal', this.socket);

    return new Observable((subscriber) => {
      this.socket.on('atualizacao-pedido', (dados) => {
        subscriber.next(dados);
      });
    });
  }
}
