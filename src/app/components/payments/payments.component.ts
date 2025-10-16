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
import {
  MalgaPaymentRequest,
  MalgaPaymentWithTokenRequest,
  MalgaService,
} from 'src/app/malga/service/malga.service';
import { PaymentFormatter } from 'src/app/malga/utils/payment-formatter';
import { DeviceService } from 'src/app/services/device/service/device.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { convertRealToCents, formatCurrency } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  formatCurrency = formatCurrency;

  @ViewChild('meuModal') customModal!: CustomModalComponent;

  @Input() clientData!: any;
  @Input() hiredCardInfo!: any;
  @Input() hiredCard!: any;
  @Input() selectedCandidatura!: any;
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
  defaultTax: number = 19.9;

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private malgaService: MalgaService
  ) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) =>
      (currentYear + i).toString()
    );

    // this.paymentForm = this.fb.group({
    //   cardNumber: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.pattern(/^[0-9]{13,19}$/), // Cartões têm entre 13 e 19 dígitos
    //       this.validateCardNumber.bind(this),
    //     ],
    //   ],
    //   cardHolder: ['', [Validators.required, Validators.minLength(3)]],
    //   expiryMonth: ['', Validators.required],
    //   expiryYear: ['', Validators.required],
    //   cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    // cpf: ['', [Validators.required, cpfValidator]],
    // cardType: [''],
    // installments: ['', [Validators.required]],
    //   acceptedTerms: [false, Validators.requiredTrue],
    // });

    this.paymentForm = this.createPaymentForm();

    this.selectPaymentMethod('credit');
  }

  ngOnInit(): void {
    this.calculateInstallments();
    this.paymentService.getCharges().subscribe({
      next: (data) => {
        console.log('sdasdasadsasd', data);
      },
      error: (error) => {
        console.log('errorajdhkjahsdkjashd', error);
      },
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  private createPaymentForm(): FormGroup {
    return this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(19),
        ],
      ],
      cardHolder: ['', [Validators.required]],
      expiryMonth: [
        '',
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      expiryYear: ['', [Validators.required, Validators.min(2024)]],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
      cpf: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(14),
        ],
      ],
      cardType: [''],
      installments: ['', [Validators.required]],
      acceptedTerms: [false, Validators.requiredTrue],
    });
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

  // async submitPayment(): Promise<void> {
  //   if (this.paymentMethod === 'credit') {
  //     if (this.paymentForm.invalid) {
  //       this.paymentForm.markAllAsTouched();
  //       return;
  //     }

  //     this.processingPayment = true;

  //     const formValue = this.paymentForm.value;
  //     const deviceInfo = await this.deviceService.getDeviceInfo();

  //     const requestData = {
  //       id_pedido: this.hiredCardInfo.id_pedido,
  // totalAmount: this.totalWithTax,
  // originAmount: convertRealToCents(
  //   this.hiredCardInfo.candidaturas[0].valor_negociado
  // ),
  //       currency: 'BRL',
  //       order: {
  //         order_id: 'ORDER-' + Date.now(),
  //         product_type: 'service',
  //       },
  //       customer: {
  //         customer_id: this.clientData.id_cliente.toString(),
  //         first_name: this.clientData.nome,
  //         last_name: this.clientData.sobrenome,
  //         document_type: 'CPF',
  //         document_number: formValue.cpf.replace(/\D/g, ''),
  //         email: this.clientData.email,
  //         phone_number: this.clientData.telefone,
  //         billing_address: {
  //           street: this.hiredCard.address.street,
  //           number: this.hiredCard.address.number,
  //           district: this.hiredCard.address.neighborhood,
  //           city: this.hiredCard.address.city,
  //           state: this.hiredCard.address.state,
  //           country: this.hiredCard.address.country,
  //           postal_code: this.hiredCard.address.cep.replace(/\D/g, ''),
  //         },
  //       },
  //       device: deviceInfo,
  //       credit: {
  //         delayed: false,
  //         save_card_data: false,
  //         transaction_type:
  //           this.selectedInstallmentOption.installments === 1
  //             ? 'FULL'
  //             : 'INSTALL_NO_INTEREST',
  //         number_installments: this.selectedInstallmentOption.installments || 1,
  //         amount_installment: this.selectedInstallmentOption.installmentValue,
  //         soft_descriptor: 'TUDU Serviços',
  //         dynamic_mcc: 7299,
  //         card: {
  //           number_token: formValue.cardNumber.replace(/\D/g, ''),
  //           brand: formValue.cardType.toUpperCase(),
  //           security_code: formValue.cvv,
  //           expiration_month: formValue.expiryMonth,
  //           expiration_year: formValue.expiryYear.slice(-2),
  //           cardholder_name: formValue.cardHolder.toUpperCase(),
  //         },
  //       },
  //     };

  //     this.paymentService.pagarComCartao(requestData).subscribe({
  //       next: (res: any) => {
  //         this.closeModalIndicator = res.success ? 'success' : 'error';

  //         this.processingPayment = false;

  //         if (res.success) {
  //           // Pagamento bem-sucedido
  //           this.customModal.openModal();
  //           this.customModal.configureModal(
  //             'success',
  //             'Pagamento aprovado com sucesso!'
  //           );
  //         } else {
  //           // Pagamento falhou
  //           this.customModal.openModal();
  //           this.customModal.configureModal(
  //             'error',
  //             res.details[0].description || 'Pagamento não realizado.'
  //           );
  //         }
  //       },
  //       error: (err) => {
  //         this.processingPayment = false;
  //         this.customModal.openModal();
  //         this.customModal.configureModal(
  //           'error',
  //           err.details[0].description || 'Pagamento não realizado.'
  //         );
  //       },
  //     });
  //   } else if (this.paymentMethod === 'pix') {
  //     if (!this.acceptedTerms) return;

  //     this.processingPayment = true;
  //     setTimeout(() => {
  //       this.processingPayment = false;
  //       this.customModal.openModal();
  //       console.log('Pagamento via Pix simulado com sucesso');
  //     }, 2000);
  //   }
  // }

  async submitPayment(): Promise<void> {
    if (this.paymentMethod === 'credit') {
      if (this.paymentForm.invalid) {
        this.paymentForm.markAllAsTouched();
        return;
      }

      this.processingPayment = true;

      const formValue = this.paymentForm.value;

      // OPÇÃO 1: Tokenizar e pagar em uma única chamada (RECOMENDADO)
      await this.tokenCardNumber(formValue);
    } else if (this.paymentMethod === 'pix') {
      await this.processPixPayment();
    }
  }

  public tokenCardNumber(formValue: any) {
    const tokenData: any = {
      cardNumber: formValue.cardNumber.replace(/\s/g, ''),
      cardCvv: formValue.cvv,
      cardExpirationDate: `${formValue.expiryMonth}/${formValue.expiryYear}`,
      cardHolderName: formValue.cardHolder.toUpperCase(),
    };

    this.paymentService.createToken(tokenData).subscribe({
      next: (data: any) => {
        this.processTokenizeAndPay(formValue, data.tokenId);
      },
      error: (error: any) => {},
    });
  }

  // OPÇÃO 1: Tokenizar e pagar em uma única chamada (Atualizado para Malga)
  private async processTokenizeAndPay(
    formValue: any,
    cardToken?: any
  ): Promise<void> {
    const deviceInfo = await this.deviceService.getDeviceInfo();

    const paymentData: MalgaPaymentRequest = {
      // Dados básicos da transação (formato Malga)
      amount: this.totalWithTax,
      originAmount: convertRealToCents(
        this.hiredCardInfo.candidaturas[0].valor_negociado
      ),
      currency: 'BRL',
      statementDescriptor: 'TUDU',
      description: `Pedido ORDER-${Date.now()}`,
      capture: true,
      orderId: 'ORDER-' + Date.now(),

      // Payment Method (formato Malga) - CORRETO
      paymentMethod: {
        paymentType: 'credit', // ← ESTÁ CORRETO!
        installments: this.selectedInstallmentOption.installments || 1,
      },

      // Payment Source (formato Malga)
      paymentSource: {
        sourceType: 'card',
        card: {
          cardNumber: cardToken,
          cardCvv: formValue.cvv,
          cardExpirationDate: `${formValue.expiryMonth}/${formValue.expiryYear}`,
          cardHolderName: formValue.cardHolder.toUpperCase(),
        },
      },

      // Customer (formato Malga)
      customer: {
        name: `${this.clientData.nome} ${this.clientData.sobrenome}`,
        email: this.clientData.email,
        phoneNumber: PaymentFormatter.formatPhoneNumber(
          this.clientData.telefone
        ),
        document: {
          type: 'cpf',
          number: PaymentFormatter.formatDocument(formValue.cpf),
        },
        address: {
          street: this.hiredCard.address.street,
          number: this.hiredCard.address.number.toString(),
          district: this.hiredCard.address.neighborhood,
          city: this.hiredCard.address.city,
          state: this.hiredCard.address.state,
          country: this.hiredCard.address.country || 'BR',
          zipCode: PaymentFormatter.formatZipCode(this.hiredCard.address.cep),
        },
      },

      // App Info (opcional)
      appInfo: {
        platform: {
          integrator: 'tudu-servicos',
          name: 'tudu-servicos',
          version: '1.0',
        },
        device: {
          name: deviceInfo.plataform,
          version: '1.0',
        },
        system: {
          name: 'Tudu Serviços',
          version: '1.0',
        },
      },

      // Campo para compatibilidade com seu backend
      id_pedido: this.hiredCard.id_pedido,

      installment_data: {
        total_with_tax: this.totalWithTax,
        installments: this.selectedInstallmentOption.installments,
        installment_value: this.selectedInstallmentOption.installmentValue,
      },
    };
    // Dados de parcelamento para validação no backend
    // credit: {
    //   number_installments: this.selectedInstallmentOption.installments || 1,
    //   amount_installment: PaymentFormatter.convertRealToCents(
    //     this.selectedInstallmentOption.installmentValue
    //   ),
    //   soft_descriptor: 'TUDU',
    //   transaction_type: 'pre_authorization',
    // },

    // totalAmount: PaymentFormatter.convertRealToCents(this.totalWithTax),
    // originAmount: PaymentFormatter.convertRealToCents(this.totalAmount),

    // Chamada para o serviço atualizado
    this.malgaService.tokenizeAndPay(paymentData).subscribe({
      next: (res) => {
        this.processingPayment = false;
        this.handlePaymentResponse(res);
      },
      error: (error) => {
        this.processingPayment = false;
        this.handlePaymentError(error);
      },
    });
  }

  // Atualize também o handlePaymentResponse para lidar com pré-autorização
  // private handlePaymentResponse(response: any): void {
  //   if (response.success) {
  //     if (response.capture === false) {
  //       // Pré-autorização bem-sucedida - aguardar captura
  //       this.showSuccessMessage(
  //         'Pré-autorização realizada com sucesso! ' +
  //           'O valor foi reservado em seu cartão e será capturado em breve.'
  //       );

  //       // Guardar o charge_id para captura futura
  //       this.storeChargeId(response.charge_id);
  //     } else {
  //       // Captura imediata bem-sucedida
  //       this.showSuccessMessage('Pagamento realizado com sucesso!');
  //     }

  //     // Navegar para página de sucesso
  //     this.router.navigate(['/payment-success'], {
  //       state: {
  //         paymentData: response,
  //         orderId: response.id_pedido,
  //       },
  //     });
  //   } else {
  //     this.handlePaymentError(response);
  //   }
  // }

  // Método para capturar pré-autorização posteriormente
  // async capturePreAuthorizedPayment(
  //   chargeId: string,
  //   amount?: number
  // ): Promise<void> {
  //   this.malgaService.captureCharge(chargeId, amount).subscribe({
  //     next: (res) => {
  //       console.log('Captura realizada com sucesso:', res);
  //       // Atualizar status do pedido no seu sistema
  //     },
  //     error: (error) => {
  //       console.error('Erro na captura:', error);
  //       // Tratar erro de captura
  //     },
  //   });
  // }

  // Armazenar charge_id para uso futuro
  private storeChargeId(chargeId: string): void {
    // Salvar no localStorage, service state, ou enviar para seu backend
    localStorage.setItem('last_charge_id', chargeId);
  }
  // Processar pagamento PIX
  private async processPixPayment(): Promise<void> {
    if (!this.acceptedTerms) return;

    this.processingPayment = true;

    const pixData = {
      merchantId: environment.malgaMerchantId,
      amount: PaymentFormatter.convertRealToCents(this.totalWithTax),
      currency: 'BRL',
      orderId: 'ORDER-' + Date.now(),
      customer: {
        name: PaymentFormatter.getFullName(
          this.clientData.nome,
          this.clientData.sobrenome
        ),
        email: this.clientData.email,
        phoneNumber: PaymentFormatter.formatPhoneNumber(
          this.clientData.telefone
        ),
        document: {
          type: 'cpf',
          number: PaymentFormatter.formatDocument(
            this.clientData.id_cliente.toString()
          ),
        },
      },
    };

    this.malgaService.processPixPayment(pixData).subscribe({
      next: (res: any) => {
        this.processingPayment = false;
        this.handlePixSuccess(res);
      },
      error: (error) => {
        this.processingPayment = false;
        this.handlePaymentError(error);
      },
    });
  }

  private handlePaymentResponse(response: any): void {
    if (response.status === 'approved' || response.status === 'captured') {
      this.handlePaymentSuccess(response);
    } else if (response.status === 'pending') {
      this.handlePaymentPending(response);
    } else {
      this.handlePaymentError(response.message || 'Pagamento não aprovado');
    }
  }

  private handlePaymentSuccess(response: any): void {
    this.closeModalIndicator = 'success';
    this.customModal.openModal();
    this.customModal.configureModal(
      'success',
      'Pagamento aprovado com sucesso!'
    );

    // Salvar tokenId se retornado (para compras futuras)
    if (response.tokenId) {
      this.saveTokenForFutureUse(response.tokenId);
    }

    console.log('Pagamento aprovado:', response);
  }

  private handlePaymentPending(response: any): void {
    this.closeModalIndicator = 'warning';
    this.customModal.openModal();
    this.customModal.configureModal(
      'warning',
      'Pagamento pendente de confirmação'
    );
  }

  private handlePixSuccess(response: any): void {
    this.closeModalIndicator = 'success';
    this.customModal.openModal();
    this.customModal.configureModal('success', 'PIX gerado com sucesso!');
  }

  private handlePaymentError(error: any): void {
    this.closeModalIndicator = 'error';
    const errorMessage = this.getErrorMessage(error);
    this.customModal.openModal();
    this.customModal.configureModal('error', errorMessage);
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) return error.error.message;
    if (error.details?.[0]?.description) return error.details[0].description;
    if (error.message) return error.message;
    return 'Erro ao processar pagamento. Tente novamente.';
  }

  private saveTokenForFutureUse(tokenId: string): void {
    // Implementar lógica para salvar o token para uso futuro
    localStorage.setItem('saved_card_token', tokenId);
    console.log('Token salvo para uso futuro:', tokenId);
  }

  // Método para usar cartão salvo (token) em compras futuras
  useSavedCard(tokenId: string, securityCode: string): void {
    const paymentData: MalgaPaymentWithTokenRequest = {
      merchantId: environment.malgaMerchantId,
      amount: PaymentFormatter.convertRealToCents(this.totalWithTax),
      currency: 'BRL',
      orderId: 'ORDER-' + Date.now(),
      customer: {
        name: PaymentFormatter.getFullName(
          this.clientData.nome,
          this.clientData.sobrenome
        ),
        email: this.clientData.email,
        phoneNumber: PaymentFormatter.formatPhoneNumber(
          this.clientData.telefone
        ),
        document: {
          type: 'cpf',
          number: PaymentFormatter.formatDocument(this.paymentForm.value.cpf),
        },
        address: {
          street: this.hiredCard.address.street,
          number: this.hiredCard.address.number.toString(),
          neighborhood: this.hiredCard.address.neighborhood,
          city: this.hiredCard.address.city,
          state: this.hiredCard.address.state,
          country: this.hiredCard.address.country,
          zipCode: PaymentFormatter.formatZipCode(this.hiredCard.address.cep),
        },
      },
      tokenId: tokenId,
      securityCode: securityCode,
      installments: this.selectedInstallmentOption.installments || 1,
    };

    this.malgaService.processPaymentWithToken(paymentData).subscribe({
      next: (res) => this.handlePaymentResponse(res),
      error: (error) => this.handlePaymentError(error),
    });
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
              this.installmentData.options[11].installments.toString(),
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

  get totalWithTax(): number {
    return (
      (this.selectedInstallmentOption?.totalValue || 0) +
      (this.defaultTax || 0) * 100
    );
  }
  get candidatura(): any {
    const candidato = this.hiredCardInfo.candidaturas.find(
      (candidato: any) => candidato.prestador_id === this.selectedCandidatura
    );

    return candidato;
  }
}
