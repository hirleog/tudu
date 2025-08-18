import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { convertRealToCents } from 'src/app/utils/utils';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  @Input() clientData!: any;
  @Input() hiredCardInfo!: any;
  @Input() hiredCard!: any;
  @Output() backToOffer = new EventEmitter<string>();
  @Output() payHiredCard = new EventEmitter<string>();

  paymentMethod: string = 'pix';
  pixGenerated: boolean = false;
  cardFlipped: boolean = false;
  showCvvHelp: boolean = false;
  processingPayment: boolean = false;
  showSuccessModal: boolean = false;
  acceptedTerms: boolean = false;
  saveCard: boolean = false;
  installments: string = '1';

  paymentForm: FormGroup;

  months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  years: string[];

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private route: Router
  ) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) =>
      (currentYear + i).toString()
    );

    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{13,19}$/), // Cartões têm entre 13 e 19 dígitos
          this.validateCardNumber.bind(this),
        ],
      ],
      cardHolder: ['', [Validators.required, Validators.minLength(3)]],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardType: [''],
      installments: ['1'],
      acceptedTerms: [false, Validators.requiredTrue],
    });

    this.selectPaymentMethod('credit');
  }

  get f() {
    return this.paymentForm.controls;
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    if (method === 'pix') {
      this.paymentForm.reset({
        installments: '1',
        acceptedTerms: false,
      });
    }
  }

  generatePix(): void {
    this.pixGenerated = true;
  }

  detectCardType(): void {
    const num = this.paymentForm.value.cardNumber.replace(/\D/g, '');
    let cardType = '';

    // Expressões regulares atualizadas para detectar bandeiras
    const cardPatterns = [
      { type: 'visa', pattern: /^4/ },
      {
        type: 'mastercard',
        pattern:
          /^(5[1-5]|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/,
      },
      { type: 'amex', pattern: /^3[47]/ },
      { type: 'diners', pattern: /^3(?:0[0-5]|[68][0-9])/ },
      {
        type: 'discover',
        pattern:
          /^6(?:011|5[0-9]{2}|4[4-9][0-9]|22(?:1(?:2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9(?:[01][0-9]|2[0-5])))/,
      },
      { type: 'jcb', pattern: /^(?:2131|1800|35\d{3})/ },
      { type: 'hipercard', pattern: /^(606282\d{10}(\d{3})?|3841\d{15})$/ },
      {
        type: 'elo',
        pattern:
          /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
      },
      { type: 'aura', pattern: /^50[0-9]/ },
      { type: 'hiper', pattern: /^637(095|568|599|612|609)/ },
    ];

    for (const { type, pattern } of cardPatterns) {
      if (pattern.test(num)) {
        cardType = type;
        break;
      }
    }

    this.paymentForm.patchValue({ cardType });
  }

  getCardLogo(): string {
    const cardType = this.paymentForm.value.cardType;
    if (!cardType) return '';

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
      aura: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Aura_-_logo.png',
      hiper:
        'https://upload.wikimedia.org/wikipedia/commons/5/5a/Hiper_logo.svg',
    };

    return logos[cardType] || '';
  }

  formatCardNumberDisplay(): string {
    const cardNumber = this.paymentForm.value.cardNumber;
    if (!cardNumber) return '';

    const num = cardNumber.replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < num.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += num[i];
    }

    return formatted;
  }

  submitPayment(): void {
    if (this.paymentMethod === 'credit') {
      if (this.paymentForm.invalid) {
        this.paymentForm.markAllAsTouched();
        return;
      }

      this.processingPayment = true;

      const formValue = this.paymentForm.value;
      const cardHolderName = formValue.cardHolder.toUpperCase();
      const nameParts = cardHolderName.split(' ');
      // const firstName = nameParts[0];
      // const lastName = nameParts.slice(1).join(' ');

      // Você precisará implementar a geração do number_token ou obtê-lo de um serviço
      // Este é um exemplo - substitua pela sua lógica real de tokenização

      const requestData = {
        amount: convertRealToCents(
          this.hiredCardInfo.candidaturas[0].valor_negociado
        ),
        currency: 'BRL',
        order: {
          order_id: 'ORDER-' + Date.now(), // ID único baseado no timestamp
          product_type: 'service',
        },
        customer: {
          customer_id: this.clientData.id_cliente, // Ou gere um ID único se necessário
          first_name: this.clientData.nome,
          last_name: this.clientData.sobrenome,
          document_type: 'CPF',
          // document_number: this.clientData.cpf, // Substitua pelo CPF real ou obtenha do formulário
          document_number: '49306837852', // Substitua pelo CPF real ou obtenha do formulário
          email: this.clientData.email, // Substitua pelo email real ou obtenha do formulário
          phone_number: this.clientData.telefone, // Substitua pelo telefone real
          billing_address: {
            street: this.hiredCard.address.street,
            number: this.hiredCard.address.number,
            district: this.hiredCard.address.neighborhood,
            city: this.hiredCard.address.city,
            state: this.hiredCard.address.state,
            country: this.hiredCard.address.country,
            postal_code: this.hiredCard.address.cep.replace(/\D/g, ''),
          },
        },
        device: {
          ip_address: '127.0.0.1', // Implemente esta função ou use um valor fixo para testes
        },
        credit: {
          delayed: false,
          save_card_data: false, // Usando o campo saveCard que você já tem
          transaction_type: 'FULL',
          number_installments: parseInt(formValue.installments),
          soft_descriptor: 'TUDU',
          dynamic_mcc: 7299,
          card: {
            number_token: formValue.cardNumber.replace(/\D/g, ''), // Gerado anteriormente
            brand: formValue.cardType.toUpperCase(), // Já ajustado para MASTERCARD, VISA, etc.
            security_code: formValue.cvv,
            expiration_month: formValue.expiryMonth,
            expiration_year: formValue.expiryYear.slice(-2), // Pega apenas os últimos 2 dígitos
            cardholder_name: formValue.cardHolder.toUpperCase(),
          },
        },
      };

      this.paymentService.pagarComCartao(requestData).subscribe({
        next: (res) => {
          console.log('Pagamento autorizado:', res);
          this.processingPayment = false;
          this.showSuccessModal = true;
        },
        error: (err) => {
          console.error('Erro no pagamento:', err);
          this.processingPayment = false;
          // Adicione tratamento de erro na UI conforme necessário
        },
      });
    } else if (this.paymentMethod === 'pix') {
      if (!this.acceptedTerms) return;

      this.processingPayment = true;
      setTimeout(() => {
        this.processingPayment = false;
        this.showSuccessModal = true;
        console.log('Pagamento via Pix simulado com sucesso');
      }, 2000);
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.route.navigate(['/home/progress']);
  }

  goBack(indicator: any): void {
    this.backToOffer.emit(indicator);
  }

  payCard(paymentIndicator: string): void {
    this.payHiredCard.emit(paymentIndicator);
  }

  validateCardNumber(control: AbstractControl): ValidationErrors | null {
    const num = control.value.replace(/\D/g, '');

    // Verifica o algoritmo de Luhn (módulo 10)
    let sum = 0;
    let shouldDouble = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const isValid = sum % 10 === 0;

    return isValid ? null : { invalidCardNumber: true };
  }
}
