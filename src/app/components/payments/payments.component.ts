import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device/service/device.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { convertRealToCents, cpfValidator } from 'src/app/utils/utils';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  @Input() clientData!: any;
  @Input() hiredCardInfo!: any;
  @Input() hiredCard!: any;
  @Output() backToOffer = new EventEmitter<string>();
  @Output() payHiredCard = new EventEmitter<string>();

  pixGenerated: boolean = false;
  cardFlipped: boolean = false;
  showCvvHelp: boolean = false;
  processingPayment: boolean = false;
  acceptedTerms: boolean = false;
  saveCard: boolean = false;
  installments: string = '1';

  paymentForm: FormGroup;

  months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  years: string[];

  closeModalIndicator: string = '';
  installmentsTableData: any[] = [];
  installmentData: any;
  selectedInstallmentOption: any;

  paymentMethod: 'pix' | 'credit' | null = null;

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private deviceService: DeviceService
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
      cpf: ['', [Validators.required, cpfValidator]],
      cardType: [''],
      installments: ['', [Validators.required]],
      acceptedTerms: [false, Validators.requiredTrue],
    });

    this.selectPaymentMethod('credit');
  }

  ngOnInit(): void {
    this.calculateInstallments();
  }

  get f() {
    return this.paymentForm.controls;
  }

  selectPaymentMethod(method: 'pix' | 'credit'): void {
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
      const deviceInfo = this.deviceService.getDeviceInfo();

      const requestData = {
        id_pedido: this.hiredCardInfo.id_pedido,
        totalAmount: this.selectedInstallmentOption.totalValue,
        originAmount: convertRealToCents(
          this.hiredCardInfo.candidaturas[0].valor_negociado
        ),
        currency: 'BRL',
        order: {
          order_id: 'ORDER-' + Date.now(),
          product_type: 'service',
        },
        customer: {
          customer_id: this.clientData.id_cliente.toString(),
          first_name: this.clientData.nome,
          last_name: this.clientData.sobrenome,
          document_type: 'CPF',
          document_number: formValue.cpf.replace(/\D/g, ''),
          email: this.clientData.email,
          phone_number: this.clientData.telefone,
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
        device: deviceInfo,
        credit: {
          delayed: false,
          save_card_data: false,
          transaction_type:
            this.selectedInstallmentOption.installments === 1
              ? 'FULL'
              : 'install_With_Interest',
          number_installments: this.selectedInstallmentOption.installments || 1,
          amount_installment: this.selectedInstallmentOption.installmentValue,
          soft_descriptor: 'TUDU Serviços',
          dynamic_mcc: 7299,
          card: {
            number_token: formValue.cardNumber.replace(/\D/g, ''),
            brand: formValue.cardType.toUpperCase(),
            security_code: formValue.cvv,
            expiration_month: formValue.expiryMonth,
            expiration_year: formValue.expiryYear.slice(-2),
            cardholder_name: formValue.cardHolder.toUpperCase(),
          },
        },
      };

      this.paymentService.pagarComCartao(requestData).subscribe({
        next: (res: any) => {
          this.closeModalIndicator = res.success ? 'success' : 'error';

          this.processingPayment = false;

          if (res.success) {
            // Pagamento bem-sucedido
            this.customModal.openModal();
            this.customModal.configureModal(
              true,
              'Pagamento aprovado com sucesso!'
            );
          } else {
            // Pagamento falhou
            this.customModal.openModal();
            this.customModal.configureModal(
              false,
              res.details[0].description || 'Pagamento não realizado.'
            );
          }
        },
        error: (err) => {
          this.processingPayment = false;
          this.customModal.openModal();
          this.customModal.configureModal(
            false,
            err.details[0].description || 'Pagamento não realizado.'
          );
        },
      });
    } else if (this.paymentMethod === 'pix') {
      if (!this.acceptedTerms) return;

      this.processingPayment = true;
      setTimeout(() => {
        this.processingPayment = false;
        this.customModal.openModal();
        console.log('Pagamento via Pix simulado com sucesso');
      }, 2000);
    }
  }
  calculateInstallments() {
    const totalAmount = convertRealToCents(
      this.hiredCardInfo.candidaturas[0].valor_negociado
    );

    const payload = {
      totalValue: totalAmount,
    };

    this.paymentService.calculateInstallments(payload).subscribe({
      next: (response) => {
        this.installmentData = response;

        // SELECIONA A PRIMEIRA OPÇÃO APÓS RECEBER OS DADOS
        if (
          this.installmentData.options &&
          this.installmentData.options.length > 0
        ) {
          // Define o valor no formControl
          this.paymentForm.patchValue({
            installments:
              this.installmentData.options[0].installments.toString(),
          });

          // Atualiza a variável selectedInstallmentOption
          this.selectedInstallmentOption = this.installmentData.options[0];

          // Opcional: Dispara o change event manualmente
          this.onInstallmentChange();
        }
      },
      error: (error) => {
        console.error('Erro ao buscar tabela de parcelas:', error);
      },
    });
  }

  onInstallmentChange() {
    const selectedValue = this.paymentForm.get('installments')?.value;

    // Encontra a opção completa baseada no valor selecionado
    this.selectedInstallmentOption = this.installmentData.options.find(
      (opt: any) => opt.installments.toString() === selectedValue
    );

    console.log('Parcela selecionada:', this.selectedInstallmentOption);
  }

  // Método para quando o usuário mudar manualmente a seleção
  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedInstallmentOption = this.installmentData.options.find(
      (opt: any) => opt.installments.toString() === selectedValue
    );

    console.log('Parcela selecionada:', this.selectedInstallmentOption);
  }

  // cancelarPagamento(idPagamento: string) {
  //   this.loading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   this.paymentService.cancelarPagamento(idPagamento).subscribe({
  //     next: (response: any) => {
  //       if (response.success) {
  //         this.successMessage = 'Pagamento cancelado com sucesso!';
  //         this.carregarPagamentos(); // Recarrega a lista
  //       } else {
  //         this.errorMessage = response.error || 'Erro ao cancelar pagamento';
  //       }
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Erro de conexão ao cancelar pagamento';
  //       this.loading = false;
  //       console.error('Erro:', error);
  //     },
  //   });
  // }

  closePaymentModal(): void {
    this.customModal.closeModal();
    this.payHiredCard.emit(this.closeModalIndicator);
  }

  goBack(indicator: any): void {
    this.backToOffer.emit(indicator);
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

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.paymentForm.get('cpf')?.setValue(value, { emitEvent: false });
  }
}
