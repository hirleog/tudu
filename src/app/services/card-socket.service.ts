import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardSocketService {
  private socket: Socket;
  private ultimoIdPedido: string | null = null;

  constructor() {
    this.socket = io(environment.apiUrl, {
      path: '/socket.io', // garante que Nginx roteie corretamente
      transports: ['websocket'],
      secure: true,
      withCredentials: true,
    });
    this.socket.on('connect', () => {
      console.log('Conectado ao WS');
      // Se já tivermos um ID de pedido, entramos na sala de novo automaticamente ao reconectar
      if (this.ultimoIdPedido) {
        this.entrarNaSalaDoPedido(this.ultimoIdPedido);
      }
    });
  }
  ouvirAtualizacaoPedido(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('atualizacao-pedido', (dados) => {
        subscriber.next(dados);
      });
    });
  }

  ouvirAlertaNovaCandidatura(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('alerta-nova-candidatura', (data) => {
        observer.next(data);
      });
      console.log('Conectado ao socket de candidatura');
    });
  }

  // PAGBANK
  entrarNaSalaDoPedido(referenceId: string) {
    this.ultimoIdPedido = referenceId;
    console.log(`[WS] Solicitando entrada na sala: order:${referenceId}`);

    this.socket.emit('joinOrderRoom', referenceId, (roomName: string) => {
      console.log(`[WS] Confirmação do servidor: conectado à sala ${roomName}`);
    });
  }

  ouvirStatusPagamento(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('paymentStatus', (data) => {
        observer.next(data);
      });

      // Cleanup ao destruir o componente
      return () => {
        this.socket.off('paymentStatus');
      };
    });
  }
}
