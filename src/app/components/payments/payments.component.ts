import { Component, Input, OnInit } from '@angular/core';
// import { initMercadoPago, PaymentOptions } from '@mercadopago/sdk-js';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  @Input() amount!: number; // Valor do pagamento
  @Input() description!: string; // Descrição do serviço

  // mercadoPago: PaymentOptions | null = null;

  ngOnInit(): void {
    // Inicializando o Mercado Pago com a chave pública
    // this.mercadoPago = initMercadoPago('SUA_PUBLIC_KEY'); // Substitua pela sua chave pública
  }

  checkout(): void {
    // if (!this.mercadoPago) return;

    // // Criando um botão de checkout do Mercado Pago
    // this.mercadoPago.bricks().create("wallet", "button-container", {
    //   initialization: {
    //     preferenceId: "PREFERENCE_ID", // Substitua pelo ID da preferência
    //   }
    // });
  }
}
