import { Component } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
})
export class PaymentsComponent {
  constructor(private paymentService: PaymentService) {}

  pagar() {
    const payload = {
      amount: 1000,
      order_id: 'pedido001',
      customer_id: 'cliente001',
      first_name: 'Fulano',
      last_name: 'Silva',
      card_number: '5155901222280001',
      cardholder_name: 'Fulano de Tal',
      expiration_month: '12',
      expiration_year: '28',
      security_code: '123',
      brand: 'mastercard',
    };

    this.paymentService.pagarComCartao(payload).subscribe({
      next: (res) => console.log('Pagamento autorizado:', res),
      error: (err) => console.error('Erro no pagamento:', err),
    });
  }
}
