import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  Observable,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagbankService {
  // O "emissor" do evento de status
  private statusPagamentoSource = new BehaviorSubject<string>('pending');
  // O "ouvinte" público que qualquer componente pode assinar
  public statusPagamento$ = this.statusPagamentoSource.asObservable();

  private pollingSub?: Subscription;
  private stopPolling$ = new Subject<void>();
  constructor(private http: HttpClient) {}

  createPixCharge(pixData: any): Observable<any> {
    // O backend agora espera apenas o reference_id
    const payload = {
      reference_id: pixData.reference_id,
      totalWithTax: pixData.totalWithTax,
    };

    return this.http.post(
      `${environment.apiUrl}/pagseguro/orders/pix`,
      payload
    );
  }

  cancelPixPayment(
    chargeId: string,
    payload: { amount?: number }
  ): Observable<any> {
    // ⚠️ ATENÇÃO: Ajuste a URL do endpoint para bater no novo método do seu NestJS
    return this.http.post<any>(
      `${environment.apiUrl}/pagseguro/${chargeId}/pix-cancel`, // Exemplo de endpoint ajustado
      payload // O payload continua o mesmo para enviar o amount (opcional)
    );
  }

  statusPaymentVerify(idPagamento: string) {
    return this.http.get<{ status: string }>(
      `${environment.apiUrl}/pagseguro/pix/status/${idPagamento}`
    );
  }

  // Inicia o polling globalmente
  // monitorarPagamentoGlobal(orderId: string) {
  //   this.pararMonitoramento(); // Evita duplicados

  //   this.pollingSub = timer(0, 5000)
  //     .pipe(
  //       switchMap(() => this.statusPaymentVerify(orderId)),
  //       // Para o polling se for pago ou se o serviço decidir
  //       takeWhile((res) => res.status === 'pending', true)
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.statusPagamentoSource.next(res.status);
  //         if (res.status === 'paid') {
  //           this.pararMonitoramento();
  //         }
  //       },
  //     });
  // }

  monitorarPagamentoGlobal(orderId: string): Observable<any> {
    this.stopPolling$.next();

    return timer(0, 5000).pipe(
      takeUntil(this.stopPolling$),
      switchMap(() => this.statusPaymentVerify(orderId)),
      tap((res) => {
        // 1. SEMPRE avisa o AppComponent qual o novo status
        this.statusPagamentoSource.next(res.status);

        // 2. Se não estiver mais pendente (Paid, Expired, Canceled), para o timer
        if (res.status !== 'pending') {
          this.stopPolling$.next();
        }
      }),
      // Inclui o objeto final que não é 'pending' no fluxo para o subscribe receber
      takeWhile((res) => res.status === 'pending', true),
      // O subscribe aqui só vai disparar se for o objeto de sucesso (paid)
      filter((res) => res.status === 'paid'),
      take(1)
    );
  }

  pararMonitoramento(): void {
    this.stopPolling$.next();
    this.statusPagamentoSource.next('idle'); // Status neutro
  }

  // monitorarPagamentoGlobal(orderId: string) {
  //   this.pararMonitoramento();

  //   this.pollingSub = timer(0, 5000)
  //     .pipe(
  //       switchMap(() => this.statusPaymentVerify(orderId)),
  //       // ✅ A MÁGICA ESTÁ AQUI:
  //       // Ele continua enquanto for 'pending'.
  //       // Quando recebe 'paid', ele envia o 'paid' uma última vez e ENCERRA o polling.
  //       takeWhile((res) => res.status === 'paid', true)
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Polling ativo - Status:', res.status);
  //         this.statusPagamentoSource.next(res.status);
  //       },
  //       error: (err) => console.error('Erro no polling', err),
  //       complete: () =>
  //         console.log(
  //           '✅ Polling encerrado: Pagamento concluído ou cancelado.'
  //         ),
  //     });
  // }

  // pararMonitoramento() {
  //   if (this.pollingSub) {
  //     this.pollingSub.unsubscribe();
  //   }
  // }
}
