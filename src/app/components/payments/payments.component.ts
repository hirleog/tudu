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
      next: (res) => console.log('Pagamento autorizado:', res),
      error: (err) => console.error('Erro no pagamento:', err),
    });
  }
}
