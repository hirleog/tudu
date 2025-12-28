import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { PixChargeData, PixResponse } from 'src/app/interfaces/pix.interface';
import { PagbankService } from 'src/app/services/pagbank.service';
import { Subject, timer, interval, Subscription, fromEvent } from 'rxjs';
import { switchMap, takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-pix',
  templateUrl: './checkout-pix.component.html',
  styleUrls: ['./checkout-pix.component.css'],
})
export class CheckoutPixComponent implements OnInit, OnDestroy {
  @Input() hiredCard!: any;
  @Output() handlePixSuccess = new EventEmitter<string>();
  @Output() handleErrorPix = new EventEmitter<string>();

  // Estados de Carregamento
  processingPayment: boolean = false;
  generatingPix: boolean = false;
  pixGenerated: boolean = false;
  qrCodeData: any;

  // Lógica de Polling e Tempo
  private destroy$ = new Subject<void>();
  private pollingSub?: Subscription;
  paymentStatus: string = 'pending';
  remainingSeconds: number = 0;
  displayTimer: string = '--:--';
  orderId: string = '';

  constructor(private pagbankService: PagbankService) {}

  ngOnInit(): void {
    this.processPixPayment();
    this.setupVisibilityListener();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupVisibilityListener(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (document.hidden) {
          this.stopPolling();
        } else if (this.paymentStatus === 'pending' && this.pixGenerated) {
          this.startPolling();
        }
      });
  }

  public async processPixPayment(): Promise<void> {
    this.processingPayment = true;
    this.generatingPix = true;
    this.pixGenerated = false;

    const pixData: PixChargeData = {
      reference_id: this.hiredCard.id_pedido,
      totalWithTax: 100, // Valor em centavos
    };

    this.pagbankService.createPixCharge(pixData).subscribe({
      next: (response: PixResponse) => {
        this.generatingPix = false;
        this.processingPayment = false;

        if (response.success && response.data.qr_code) {
          this.qrCodeData = response;
          this.pixGenerated = true;
          this.orderId = response.data.order_id;

          // Iniciar lógicas automáticas
          this.startCountdown(this.qrCodeData.data.qr_code.expiration_date);
          this.startPolling();
        } else {
          this.handlePaymentError(response.message || 'Erro ao gerar QR Code');
        }
      },
      error: (error) => {
        this.generatingPix = false;
        this.handlePaymentError('Erro na comunicação com o servidor');
      },
    });
  }

  private startPolling(): void {
    this.stopPolling(); // Evita múltiplas subscrições

    this.pollingSub = timer(0, 5000) // Tenta imediatamente e depois a cada 5s
      .pipe(
        takeWhile(
          () => this.paymentStatus === 'pending' && this.remainingSeconds > 0
        ),
        switchMap(() => this.pagbankService.statusPaymentVerify(this.orderId))
      )
      .subscribe({
        next: (res: any) => {
          this.paymentStatus = res.status;
          
          if (this.paymentStatus === 'paid') {
            this.handlePaymentSuccess();
            this.stopPolling();
            // Opcional: Redirecionar usuário ou emitir evento de sucesso
          }
        },
        error: (err) => console.error('Erro ao consultar status', err),
      });
  }

  private stopPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  private startCountdown(expirationDateStr: string): void {
    if (!expirationDateStr) {
      console.error('Data de expiração ausente');
      return;
    }

    // Converte a string para objeto Date
    const expirationDate = new Date(expirationDateStr).getTime();
    const now = new Date().getTime();

    // Se a data for inválida, o getTime() retorna NaN
    if (isNaN(expirationDate)) {
      console.error('Data de expiração inválida:', expirationDateStr);
      return;
    }

    this.remainingSeconds = Math.max(
      0,
      Math.floor((expirationDate - now) / 1000)
    );

    console.log('Segundos calculados:', this.remainingSeconds);

    // Inicia o intervalo do relógio
    interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(
          () => this.remainingSeconds > 0 && this.paymentStatus === 'pending'
        )
      )
      .subscribe(() => {
        this.remainingSeconds--;
        this.formatTimer();
      });
  }

  private formatTimer(): void {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.displayTimer = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  // --- Seus métodos originais mantidos ---

  copyToClipboard(text: string, event?: Event): void {
    event?.preventDefault();
    navigator.clipboard.writeText(text).then(() => {
      if (event) {
        const button = event.currentTarget as HTMLElement;
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check text-green-500"></i>';
        setTimeout(() => (button.innerHTML = originalIcon), 2000);
      }
    });
  }

  handlePaymentSuccess(): void {
    this.handlePixSuccess.emit();
  }
  handlePaymentError(message: string): void {
    this.handleErrorPix.emit(message);
  }
}
