import { Component, EventEmitter, Output } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'], // Adicione o arquivo CSS se necessário
})
export class PaymentsComponent {
  @Output() backToOffer = new EventEmitter<string>(); // Emite a data no formato 'DD/MM/YYYY'
  @Output() payHiredCard = new EventEmitter<string>(); 

  // Dados do pagamento
  paymentMethod: string = 'pix';
  pixGenerated: boolean = false;
  cardFlipped: boolean = false;
  showCvvHelp: boolean = false;
  processingPayment: boolean = false;
  showSuccessModal: boolean = false;
  acceptedTerms: boolean = false;
  saveCard: boolean = false;
  installments: string = '1';

  // Dados do cartão
  cardData = {
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: '',
  };

  // Opções para validade
  months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  years: string[];

  constructor(private paymentService: PaymentService) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) =>
      (currentYear + i).toString()
    );
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

  generatePix(): void {
    this.pixGenerated = true;
  }

  detectCardType(): void {
    const num = this.cardData.cardNumber.replace(/\D/g, '');

    if (/^4/.test(num)) {
      this.cardData.cardType = 'visa';
    } else if (/^5[1-5]/.test(num)) {
      this.cardData.cardType = 'mastercard';
    } else if (/^3[47]/.test(num)) {
      this.cardData.cardType = 'amex';
    } else if (/^3(?:0[0-5]|[68][0-9])/.test(num)) {
      this.cardData.cardType = 'diners';
    } else if (/^6(?:011|5[0-9]{2})/.test(num)) {
      this.cardData.cardType = 'discover';
    } else if (/^(?:2131|1800|35\d{3})/.test(num)) {
      this.cardData.cardType = 'jcb';
    } else if (/^(606282\d{10}(\d{3})?)|(3841\d{15})$/.test(num)) {
      this.cardData.cardType = 'hipercard';
    } else if (
      /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/.test(
        num
      )
    ) {
      this.cardData.cardType = 'elo';
    } else {
      this.cardData.cardType = '';
    }
  }

  getCardLogo(): string {
    if (!this.cardData.cardType) return '';

    const logos: { [key: string]: string } = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
      mastercard:
        'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
      amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
      diners:
        'https://upload.wikimedia.org/wikipedia/commons/2/22/Diners_Club_International_logo.svg',
      discover:
        'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg',
      jcb: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/JCB_logo.svg',
      hipercard:
        'https://upload.wikimedia.org/wikipedia/commons/6/67/Hipercard_logo.svg',
      elo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Elo_logo.svg',
    };

    return logos[this.cardData.cardType] || '';
  }

  formatCardNumberDisplay(): string {
    if (!this.cardData.cardNumber) return '';

    const num = this.cardData.cardNumber.replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < num.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += num[i];
    }

    return formatted;
  }

  submitPayment(): void {
    this.processingPayment = true;

    if (this.paymentMethod === 'credit') {
      const payload = {
        card_number: this.cardData.cardNumber.replace(/\D/g, ''),
        customer_id: 'customer_' + Math.random().toString(36).substr(2, 9),
        amount: 1000, // Valor em centavos
        order_id: 'order_' + Math.random().toString(36).substr(2, 9),
        cardholder_name: this.cardData.cardHolder,
        expiration_month: this.cardData.expiryMonth,
        expiration_year: this.cardData.expiryYear,
        security_code: this.cardData.cvv,
        brand:
          this.cardData.cardType.charAt(0).toUpperCase() +
          this.cardData.cardType.slice(1),
        first_name: this.cardData.cardHolder.split(' ')[0],
        last_name: this.cardData.cardHolder.split(' ').slice(1).join(' '),
        email: 'user@example.com', // Você pode injetar um serviço de usuário para pegar esses dados
        installments: parseInt(this.installments),
      };

      this.paymentService.pagarComCartao(payload).subscribe({
        next: (res) => {
          console.log('Pagamento autorizado:', res);
          this.processingPayment = false;
          this.showSuccessModal = true;
        },
        error: (err) => {
          console.error('Erro no pagamento:', err);
          this.processingPayment = false;
          // Aqui você pode adicionar tratamento de erro na UI
        },
      });
    } else if (this.paymentMethod === 'pix') {
      // Lógica para processar Pix
      setTimeout(() => {
        this.processingPayment = false;
        this.showSuccessModal = true;
        console.log('Pagamento via Pix simulado com sucesso');
      }, 2000);
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
    // Aqui você pode adicionar redirecionamento ou outras ações pós-pagamento
  }

  goBack(indicator: any): void {
    this.backToOffer.emit(indicator);
  }

  pagar() {
    const payload = {
      card_number: '5155901222280001',
      customer_id: 'customer_123',
      amount: 1000,
      order_id: 'order_123',
      cardholder_name: 'JOAO DA SILVA',
      expiration_month: '12',
      expiration_year: '25',
      security_code: '123',
      brand: 'Mastercard',
      first_name: 'Joao',
      last_name: 'Silva',
      email: 'joao@example.com',
    };

    this.paymentService.pagarComCartao(payload).subscribe({
      next: (res) => {
        this.payCard('success');
      },
      error: (err) => {
        this.payCard('error');
        console.error('Erro no pagamento:', err);
      },
    });
  }
  payCard(paymentIndicator: string): void {
    this.payHiredCard.emit(paymentIndicator);
  }
}
