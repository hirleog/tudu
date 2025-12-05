import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { formatDecimal } from 'src/app/utils/utils';
import { CurrencyMaskConfig } from 'ngx-currency';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  @ViewChild('modalCandidatar') modalCandidatar!: CustomModalComponent;
  @ViewChild('modalConfirmacao') modalConfirmacao!: CustomModalComponent;
  @ViewChild('modalNegociar') modalNegociar!: CustomModalComponent;
  @Output() messageEvent = new EventEmitter<any>();

  public currencyOptions: CurrencyMaskConfig = {
    prefix: 'R$',
    thousands: '.',
    decimal: ',',
    precision: 2,
    align: 'left',
    allowNegative: false,
    allowZero: false,
    suffix: '',
    nullable: false,
  };

  isModalVisible: boolean = false;
  currentImageIndex?: number;
  activeAccordion: string | null = null;

  valorNegociado: any = 250;
  servicoMontagemDesmontagem: any =
    'Desejo uma montagem e desmontagem do movel';

  id_pedido: string = '';
  cards: CardOrders[] = [];
  flow: string = '';
  questionTitle: string = '';
  backIndicator: any;
  isProfessionalIndicator: boolean = false;
  id_prestador!: any;
  temCandidaturaDoPrestadorLogado: any;
  isLoadingBtn: boolean = false;
  modalConfirmIndicator: boolean = false;
  calendarActive: boolean = false;
  dateSelected!: string;
  timeSelected: string = '12:00';
  dateTimeSelected!: string;
  priceNegotiated: any;
  hideCalendarDays: boolean = false;
  isNotificationFlag: any;

  constructor(
    public cardService: CardService,
    private routeActive: ActivatedRoute,
    private route: Router,
    private location: Location,
    private authService: AuthService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
      this.flow = params['flow'];
      this.backIndicator = params['card'];
    });

    // recupera flag para saber que veio pelo componente notification-view
    const navigation = this.route.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.isNotificationFlag = navigation.extras.state['notificationData'];
    }

    this.isProfessionalIndicator = this.authService.isPrestadorLoggedIn();

    this.authService.idPrestador$.subscribe((id_prestador) => {
      this.id_prestador = id_prestador;
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    if (this.backIndicator) {
      this.cards = JSON.parse(this.backIndicator);

      console.log(this.cards);
    } else {
      this.getCardById();
    }

    this.location.subscribe(() => {
      this.back(); // chama seu método back() quando clicar em voltar do navegador
    });
  }
  ngAfterViewInit() {
    if (this.flow === 'recusado') {
      Promise.resolve().then(() => {
        this.handleNegotiate();
      });
    }
  }
  getCardById(): void {
    this.cardService.getCardById(this.id_pedido, this.id_prestador).subscribe({
      next: (data: any) => {
        const candidaturas = data.candidaturas || [];

        // Primeiro monta o card com ícone e candidaturas
        this.cards.push({
          ...data,
          calendarActive: false,
          icon: this.cardService.getIconByLabel(data.categoria) || '',
          candidaturas: candidaturas.map((candidatura: any) => ({
            ...candidatura,
            icon: this.cardService.getIconByLabel(data.categoria) || '',
          })),
        });

        // Verifica se existe candidatura do prestador logado
        this.temCandidaturaDoPrestadorLogado = this.cards[0].candidaturas.find(
          (candidatura: any) => candidatura.prestador_id === this.id_prestador
        );

        // Se já existe candidatura, redireciona para home/proposta
        if (
          this.temCandidaturaDoPrestadorLogado &&
          !this.isProfessionalIndicator
        ) {
          this.goToHomeSeeProposal();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  updateCard(card: CardOrders): Observable<CardOrders> {
    this.isLoadingBtn = true;

    const dateTime = this.dateTimeSelected;

    // CORREÇÃO: Verificar se a data e hora são válidas antes de formatar
    let horario_negociado_formatted = null;

    if (dateTime) {
      const momentDate = moment(dateTime, 'DD/MM/YYYY - HH:mm');

      // Verificar se a data é válida
      if (momentDate.isValid()) {
        horario_negociado_formatted = momentDate.format('YYYY-MM-DD HH:mm');
      } else {
        horario_negociado_formatted = card.horario_preferencial;
      }
    } else {
      horario_negociado_formatted = card.horario_preferencial;
    }

    const valor = formatDecimal(Number(card.valor));
    const valorNegociadoRaw = formatDecimal(Number(this.priceNegotiated));

    const formatValorNegociado =
      valorNegociadoRaw && valorNegociadoRaw !== valor
        ? valorNegociadoRaw
        : card.valor;

    // const formatValorNegociado = !candidaturaAtual
    //   ? valorNegociadoRaw && valorNegociadoRaw !== valor
    //     ? valorNegociadoRaw
    //     : card.valor
    //   : candidaturaAtual.valor_negociado !== card.valor
    //   ? candidaturaAtual.valor_negociado
    //   : card.valor;

    const valorNegociado = formatValorNegociado?.toString();
    // Determina o status com base nas negociações
    // const statusPedido =
    //   valorNegociado !== card.valor ||
    //   (horario_negociado_formatted &&
    //     horario_negociado_formatted !== card.horario_preferencial)
    //     ? 'publicado'
    //     : 'pendente';
    const statusPedido = 'publicado';

    const isAceito =
      valorNegociado === card.valor &&
      horario_negociado_formatted === card.horario_preferencial;

    const payloadCard: any = {
      id_cliente: Number(card.id_pedido),
      id_prestador: isAceito ? Number(this.id_prestador) : null,
      categoria: card.categoria,
      status_pedido: statusPedido, // Usa o status calculado
      subcategoria: card.subcategoria,
      valor: card.valor,
      horario_preferencial: card.horario_preferencial,
      data_finalizacao: card.data_finalizacao || null,

      cep: card.address.cep,
      street: card.address.street,
      neighborhood: card.address.neighborhood,
      city: card.address.city,
      state: card.address.state,
      number: card.address.number,
      complement: card.address.complement,

      candidaturas: [
        {
          prestador_id: Number(this.id_prestador),
          valor_negociado: valorNegociado,
          horario_negociado: horario_negociado_formatted, // ✅ Agora sempre será uma data válida ou null
          status: 'negociacao',
          // statusPedido === 'pendente' || isAceito ? 'aceito' : 'negociacao',
        },
      ],
    };

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: (response) => {
        this.modalConfirmIndicator = false;
        this.modalConfirmacao.openModal();
        this.modalConfirmacao.configureModal(
          'success',
          'Aguarde a confirmação do cliente. Você pode acompanhar o status do seu serviço na aba "Andamento'
        );
        this.modalNegociar.closeModal();
        this.isLoadingBtn = false;

        // Limpa todos os estados antes de navegar
        // if (route === '/home') {
        //   this.stateManagement.clearAllState(); // Limpa todos os estados antes de navegar
        //   this.selectItem(1); // Atualiza a lista de cartões após a atualização
        // } else {
        //   this.stateManagement.clearAllState(); // Limpa todos os estados antes de navegar
        //   this.selectItem(3); // Atualiza a lista de cartões após a atualização
        // }
      },
      error: (error) => {
        this.modalConfirmIndicator = true;
        this.modalConfirmacao.openModal();
        this.modalConfirmacao.configureModal(
          'error',
          'Tente novamente mais tarde ou entre em contato com o suporte.'
        );
        this.isLoadingBtn = false;
      },
      complete: () => {},
    });

    return of();
  }

  openCalendar(): void {
    if (!this.calendarActive) {
      this.calendarActive = true;
    }
  }
  onCalendarClose() {
    this.hideCalendarDays = false;
    this.calendarActive = false;
    // if (card.placeholderDataHora !== this.dateTimeFormatted) {
    //   card.calendarActive = true;
    // } else {
    //   card.calendarActive = false;
    // }
  }

  onDateSelected(date: string) {
    const time = this.dateTimeSelected
      ? this.dateTimeSelected.split(' - ')[1]
      : this.timeSelected; // Mantém a hora se já existir

    this.dateTimeSelected = `${date} - ${time}`;
  }

  onTimeSelected(time: string) {
    const date = this.dateTimeSelected
      ? this.dateTimeSelected.split(' - ')[0]
      : moment(this.dateSelected).format('DD/MM/YYYY'); // Mantém a data se já existir

    this.calendarActive = !this.calendarActive;
    this.dateTimeSelected = `${date} - ${time}`;
  }

  // Método para selecionar uma imagem específica na galeria
  selectImage(card: CardOrders, index: number): void {
    if (card.imagens && index >= 0 && index < card.imagens.length) {
      card.currentImageIndex = index;
    }
  }

  // Método para navegar entre as imagens (próxima/anterior)
  navigateImages(card: CardOrders, direction: number): void {
    if (card.imagens && card.imagens.length > 0) {
      let newIndex = (card.currentImageIndex || 0) + direction;
      if (newIndex < 0) {
        newIndex = card.imagens.length - 1; // Volta para a última imagem
      } else if (newIndex >= card.imagens.length) {
        newIndex = 0; // Volta para a primeira imagem
      }
      card.currentImageIndex = newIndex;
    }
  }

  back(): void {
    // ✅ Verifica se deve voltar para notificações
    if (this.isNotificationFlag === 'true' && this.flow !== 'progress') {
      this.backToNotification();
    } else if (this.isProfessionalIndicator) {
      const progressRoute =
        this.flow === 'progress'
          ? '/tudu-professional/progress'
          : '/tudu-professional/home';

      const historicRoute =
        this.flow === 'historic'
          ? '/tudu-professional/historic'
          : '/tudu-professional/home';

      if (this.flow === 'progress') {
        this.route.navigate([progressRoute]);
        return;
      } else if (this.flow === 'historic') {
        this.route.navigate([historicRoute]);
        return;
      } else {
        this.route.navigate([progressRoute], {
          queryParams: { homeFlow: this.flow },
        });
      }
    } else {
      const route = this.flow === 'progress' ? '/home/progress' : '/home';

      if (this.flow === 'progress') {
        this.route.navigate([route]);
        return;
      } else {
        this.route.navigate([route], {
          queryParams: { homeFlow: this.flow },
        });
      }
    }
  }

  backToNotification(): void {
    if (this.isProfessionalIndicator) {
      // Verifica se a rota profissional existe
      this.route
        .navigate(['/home/notifications'], {
          queryParams: {
            param: 'professional',
          },
        })
        .catch((err) => {
          console.error('Erro ao navegar para notificações profissional:', err);
          // Fallback para rota padrão
          this.route.navigate(['/tudu-professional/home']);
        });
    } else {
      // Rota para cliente
      this.route.navigate(['/home/notifications']).catch((err) => {
        console.error('Erro ao navegar para notificações cliente:', err);
        // Fallback para rota padrão
        this.route.navigate(['/home']);
      });
    }
  }
  hideMobileButtons(card: any): boolean {
    // Regra 1: Card cancelado → SEMPRE esconder
    if (
      card.status_pedido === 'cancelado' ||
      card.candidaturas[0]?.status === 'negociacao' ||
      this.flow === 'progress' ||
      !this.isProfessionalIndicator
    ) {
      return false;
    }

    // Regra 2: Profissional nos flows 'publicado' ou 'recusado' → esconder
    if (
      this.isProfessionalIndicator &&
      (this.flow === 'publicado' || this.flow === 'recusado')
    ) {
      return true;
    }

    // Demais casos: mostrar botões
    return true;
  }
  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  editarAnuncio() {
    console.log('Editar anúncio clicado');
    this.closeModal();
  }

  falarComAtendente() {
    console.log('Falar com atendente clicado');
    this.closeModal();
  }

  // Método para alternar o accordion
  toggleAccordion(section: string) {
    this.activeAccordion = this.activeAccordion === section ? null : section;
  }

  // Método para lidar com a seleção de opções
  handleOption(option: string, card?: CardOrders) {
    if (this.isProfessionalIndicator) {
      this.route.navigate(['/home/order-help'], {
        queryParams: {
          param: 'professional',
          id: this.id_pedido,
          questionTitle: option,
          card: JSON.stringify(card),
          flow: this.flow,
        },
      });
    } else {
      this.route.navigate(['/home/order-help'], {
        queryParams: {
          id: this.id_pedido,
          questionTitle: option,
          card: JSON.stringify(card),
          flow: this.flow,
        },
      });
    }
  }

  handleModalAction(card: any) {
    this.isLoadingBtn = true;
    this.updateCard(card);
  }

  goToHomeSeeProposal() {
    this.route.navigate(['/tudu-professional/home'], {
      queryParams: { homeFlow: 'seeProposal' },
    });
  }

  handleNegotiate(event?: any) {
    this.modalNegociar.openModal();
    this.modalNegociar.configureModal(
      'warning',
      'Faça sua proposta para este pedido.'
    );
  }

  handleAdvance(event: any) {
    this.modalCandidatar.openModal();
    this.modalCandidatar.configureModal(
      'warning',
      'Deseja finalizar a candidatura para este pedido?'
    );
  }
  // Métodos auxiliares para o novo layout
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      publicado: 'Disponível',
      andamento: 'Em Andamento',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
      pendente: 'Pendente',
    };
    return statusMap[status] || status;
  }

  getCandidaturaStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      negociacao: 'Em Negociação',
      aceito: 'Aceito',
      recusado: 'Recusado',
      cancelado: 'Cancelado',
    };
    return statusMap[status] || status;
  }

  formatDateTime(dateTime: string): string {
    // Implemente a formatação conforme necessário
    // Exemplo: return moment(dateTime).format('DD/MM/YYYY [às] HH:mm');
    return dateTime;
  }
}
