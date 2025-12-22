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
      path: '/socket.io', // garante que Nginx roteie corretamente
      transports: ['websocket'],
      secure: true,
      withCredentials: true,
    });
    this.socket.on('connect', () => {
      console.log('Conectado ao servidor WS:', this.socket.id);
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
    this.socket.emit('joinOrderRoom', referenceId, (res: any) => {
      console.log('Confirmação de sala:', res);
    });
  }

  ouvirStatusPagamento(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('paymentStatus', (data) => {
        observer.next(data);
      });
      // Importante: não remova o listener aqui se for reusar o service
    });
  }
}
