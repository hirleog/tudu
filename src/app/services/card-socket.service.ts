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
  ouvirStatusPagamento(orderReferenceId: string): Observable<any> {
    return new Observable((observer) => {
      // 1. Emite para entrar na sala e ESPERA a confirmação (callback)
      this.socket.emit(
        'joinOrderRoom',
        orderReferenceId,
        (roomName: string) => {
          console.log(`[WS] Entrou na sala '${roomName}'. Agora pode escutar.`);

          // 2. ✅ MOVEMOS A ESCUTA PARA DENTRO DO CALLBACK!
          //    Isso garante que só escutaremos após estarmos confirmadamente na sala.
          this.socket.on('paymentStatus', (data) => {
            observer.next(data);
          });
        }
      );

      // Opcional: Lidar com a desconexão (unsubscribe)
      return () => {
        this.socket.off('paymentStatus');
        // Se necessário, implementar client.leave(roomName) no backend
      };
    });
  }
}
