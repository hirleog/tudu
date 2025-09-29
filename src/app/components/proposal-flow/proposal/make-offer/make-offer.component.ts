import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CurrencyMaskConfig } from 'ngx-currency';
import { Observable, of, Subscription } from 'rxjs';
import { CreateCard } from 'src/app/interfaces/create-card.model';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { StateManagementService } from 'src/app/services/state-management.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { SharedService } from 'src/app/shared/shared.service';
import { formatDecimal } from 'src/app/utils/utils';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.css'],
})
export class MakeOfferComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  dateSelected: string = '';
  dateTimeSelected: string = '';
  timeSelected: string = '';

  cardTitle: string = '';
  addressContent: any;
  filters: any;

  price: any;
  renegotiateActive: boolean = false;
  calendarActive: boolean = false;
  initialDateTime: string = '';
  isLogged: boolean = false;
  id_cliente: any = '';
  selectedFiles: File[] = [];

  isLoading: boolean = false;
  clienteIsLogged: boolean = false;

  private subscriptionCliente: Subscription = new Subscription();
  serviceDescription: any;

  public currencyOptions: CurrencyMaskConfig = {
    prefix: '',
    thousands: '.',
    decimal: ',',
    precision: 2,
    align: 'left',
    allowNegative: false,
    allowZero: false,
    suffix: '',
    nullable: false,
  };
  isFirstProposal: CreateCard | null | undefined;
  priceEstimation: any;

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    public cardService: CardService,
    public authService: AuthService,
    public sharedService: SharedService,
    public stateManagementService: StateManagementService
  ) {
    this.authService.idCliente$.subscribe((id) => {
      this.id_cliente = id;
      console.log('ID do Cliente:', this.id_cliente);
    });

    this.initialDateTime = moment()
      .add(1, 'day')
      .set({ hour: 12, minute: 0, second: 0 })
      .format('DD/MM/YYYY - HH:mm');

    // this.priceEstimation = this.sharedService.getPriceEstimation();

    this.routeActive.queryParams.subscribe((params) => {
      this.filters = params['filters'] ? JSON.parse(params['filters']) : [];
      this.cardTitle = params['cardTitle'];
      this.serviceDescription = params['serviceDescription'] || '';
      this.priceEstimation = params['priceEstimation'] ? JSON.parse(params['priceEstimation']) : {};

      this.addressContent = params['addressContent']
        ? JSON.parse(params['addressContent'])
        : [];
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    // fluxo para quando o cliente não estava logado e tenta fazer uma proposta
    this.isFirstProposal = this.sharedService.getProposalData();
    if (this.isFirstProposal) {
      this.createCard();
    }

    // this.dateTimeSelected = this.initialDateTime;
    this.selectedFiles = this.sharedService.getFiles();

    this.authService.isClienteLoggedIn$.subscribe((loggedIn) => {
      this.clienteIsLogged = loggedIn;
    });

    this.price = this.priceEstimation?.basePrice?.toString();
  }

  createCard(): Observable<void> {
    this.isLoading = true;

    let payloadCard: CreateCard | undefined = undefined;

    if (this.isFirstProposal) {
      payloadCard = this.isFirstProposal;
      payloadCard.id_cliente = this.id_cliente.toString();
    } else {
      const dateTimeFormat = moment(
        this.dateTimeSelected,
        'DD/MM/YYYY - HH:mm'
      ).format('YYYY-MM-DD HH:mm');

      const filtersConcat = this.filters
        .map((category: any) =>
          category.filters.map((filter: any) => filter.label).join(', ')
        )
        .join(', ');

      const codigoConfirmacao = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      let priceToNumber = Number(this.price);
      const valorFormatado = formatDecimal(priceToNumber);
      const filters = this.priceEstimation.factors.join(', ');
      console.log('hudhas', filters);

      payloadCard = {
        id_cliente: this.id_cliente !== '' ? this.id_cliente?.toString() : '',
        id_prestador: '0',
        categoria: this.cardTitle,
        status_pedido: 'publicado',
        subcategoria: filtersConcat,
        filters: filters,
        serviceDescription: this.serviceDescription,
        valor: valorFormatado,
        horario_preferencial: dateTimeFormat,
        codigo_confirmacao: codigoConfirmacao,
        cep: this.addressContent[0].cep,
        street: this.addressContent[0].street,
        neighborhood: this.addressContent[0].neighborhood,
        city: this.addressContent[0].city,
        state: this.addressContent[0].state,
        number: this.addressContent[0].number,
        complement: this.addressContent[0].complement || '',
      };
    }

    if (!this.authService.isClienteLoggedIn()) {
      this.isLoading = false;
      this.sharedService.setProposalData(payloadCard);

      this.customModal.openModal();
      this.customModal.configureModal(
        'warning',
        'É necessario realizar login para continuar com a proposta.'
      );
      return of();
    }

    // Verifica se há arquivos selecionados
    this.cardService
      .postCardWithImages(payloadCard, this.selectedFiles || [])
      .subscribe({
        next: (response) => {
          this.stateManagementService.clearAllState();
          this.sharedService.clearProposalData();

          this.isLoading = false;
          this.route.navigate(['/home']);
        },
        error: (error) => {
          this.sharedService.clearProposalData();

          this.isLoading = false;
          console.error('Erro ao criar card:', error);
        },
      });

    return of();
  }

  onPriceClose() {
    this.renegotiateActive = !this.renegotiateActive;
    console.log('Calendar closed', this.renegotiateActive);
  }
  onCalendarClose() {
    // this.clickOutside = true
    this.calendarActive = !this.calendarActive;
    console.log('Calendar closed', this.calendarActive);
  }

  onDateSelected(date: string) {
    const time =
      this.dateTimeSelected?.split(' - ')[1] || this.timeSelected || '12:00';

    this.dateSelected = date;
    this.dateTimeSelected = `${date} - ${time}`;
  }

  onTimeSelected(time: string) {
    this.timeSelected = time;
    const date = this.dateSelected || moment().format('DD/MM/YYYY');
    this.dateTimeSelected = `${date} - ${time}`;
  }

  goBack(): void {
    this.routeActive.queryParams.subscribe((params) => {
      this.route.navigate(['/proposal/address'], {
        queryParams: {
          addressContent: params['addressContent'], // Reenvia os parâmetros
          cardTitle: params['cardTitle'], // Reenvia os parâmetros
          filters: params['filters'],
          serviceDescription: params['serviceDescription'] || '', // Reenvia a descrição do serviço
          priceEstimation: JSON.stringify(params['priceEstimation']) || '', // Reenvia a descrição do serviço
        },
      });
    });
  }

  payAndCreateCard(): void {
    this.createCard();
  }

  closeAndGoToLogin(): void {
    this.customModal.closeModal();
    this.route.navigate(['/login'], {
      queryParams: { returnUrl: '/proposal/make-offer' },
    });
  }

  parseFloat(price: string): number {
    return parseFloat(price.replace(',', '.')) || 0;
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    // this.subscriptionPrestador.unsubscribe();
  }
}
