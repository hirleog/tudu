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
    this.socket = io(environment.apiUrl); // Ajuste a URL do seu backend
  }

  ouvirAtualizacaoPedido(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('atualizacao-pedido', (dados) => {
        subscriber.next(dados);
      });
    });
  }
}
