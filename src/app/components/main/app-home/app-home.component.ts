import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { AuthService } from 'src/app/services/auth.service';
import { CardSocketService } from 'src/app/services/card-socket.service';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StateManagementService } from 'src/app/services/state-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  headerPageOptions: string[] = [];
  overlay: boolean = false;
  dateTimeFormatted: string = '';
  selectedIndex: number = 0;
  placeholderDataHora: string = '';
  cards: CardOrders[] = [];
  id_prestador: any;
  counts: any;
  flow: string = '';
  homeFlow: string = '';
  isLoading: boolean = false;

  // para paginação
  paginaAtual = 0;
  limitePorPagina = 10;
  carregandoMais = false;
  finalDaLista = false;
  logoUrl: string = '';

  clienteId!: any;
  prestadorId!: any;
  loading = false;
  result: any;
  id_cliente!: any;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    public cardService: CardService,
    public cardSocketService: CardSocketService,
    private location: Location,
    private stateManagement: StateManagementService,
    private swPush: SwPush,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {
    this.askNotificationPermission();

    this.cards.forEach((card) => {
      let dateTimeFormatted: string = '';

      if (card.horario_preferencial) {
        const formattedDate = moment(card.horario_preferencial).format(
          'DD/MM/YYYY'
        );
        const formattedTime = moment(card.horario_preferencial).format('HH:mm');
        dateTimeFormatted = `${formattedDate} - ${formattedTime}`;
        card.placeholderDataHora = dateTimeFormatted;
      }

      if (card.valor_negociado) {
        card.valor_negociado = card.valor;
      }
    });

    this.activeRoute.queryParams.subscribe((params) => {
      this.homeFlow = params['homeFlow'];
    });

    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.cardSocketService.ouvirAlertaNovaCandidatura().subscribe((data) => {
      console.log(`Nova candidatura recebida:`, data);
      const id = data.id_pedido;

      this.cardService.getCardById(id).subscribe({
        next: (data) => {
          const card: any = data;
          this.cards = this.cards.map((c) => {
            if (c.id_pedido === id) {
              return {
                ...c,
                candidaturas: [...(c.candidaturas || []), ...card.candidaturas],
                temNovaCandidatura: true,
              };
            }
            console.log('Card atualizado:', c);
            return c;
          });
        },
        error: (error) => {
          console.error('Erro ao obter o card:', error);
        },
      });
    });

    this.location.subscribe(() => {
      this.flowNavigate();
      this.cleanActualRoute();
    });
    this.flowNavigate();
  }

  async askNotificationPermission() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Permissão OK, agora o usuário pode ativar o Push.');
    } else {
      console.log('Usuário negou.');
    }
  }

  testPush() {
    this.loading = true;
    this.result = null;

    this.notificationService
      .sendTest(this.clienteId, this.prestadorId)
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: (err) => {
          this.result = err;
          this.loading = false;
        },
      });
  }

  listCards(status_pedido: string) {
    if (this.carregandoMais || this.finalDaLista) {
      return;
    }
    this.isLoading = true;

    const offset = this.paginaAtual * this.limitePorPagina;
    const currentState = this.stateManagement.getState(status_pedido);

    // Restaurar do cache na primeira chamada
    if (offset === 0 && currentState.cards.length > 0) {
      this.cards = currentState.cards;
      this.paginaAtual = currentState.pagina;
      this.finalDaLista = currentState.finalDaLista;
      this.counts = currentState.counts;
      this.updateHeaderCounts();

      // Aplica scroll sem animação
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, currentState.scrollY);
        document.documentElement.style.scrollBehavior = '';
      }, 0);

      this.isLoading = false;
      return;
    }

    this.carregandoMais = true;

    this.cardService
      .getCards(status_pedido, offset, this.limitePorPagina)
      .subscribe({
        next: (response: { cards: CardOrders[]; counts: any }) => {
          const novosCards = response.cards.map((card) => {
            const horario = card.horario_preferencial
              ? moment(card.horario_preferencial)
              : null;

            const placeholderDataHora = horario
              ? `${horario.format('DD/MM/YYYY')} - ${horario.format('HH:mm')}`
              : '';

            return {
              ...card,
              icon: this.cardService.getIconByLabel(card.categoria) || '',
              renegotiateActive: !card.valor_negociado,
              calendarActive: false,
              placeholderDataHora: [0, 1, 2].includes(this.selectedIndex)
                ? placeholderDataHora
                : '',
              valor_negociado: card.valor_negociado
                ? card.valor
                : card.valor_negociado,
            };
          });

          if (
            novosCards.length === 0 ||
            novosCards.length < this.limitePorPagina
          ) {
            this.finalDaLista = true;
            currentState.finalDaLista = true;
            this.carregandoMais = false;

            if (offset === 0) {
              // Só limpa se realmente não vieram cards
              if (novosCards.length === 0) {
                this.cards = [];
                currentState.cards = [];
              } else {
                // Se vieram alguns cards, adiciona eles
                this.cards = novosCards;
                currentState.cards = novosCards;
              }

              this.counts = response.counts;
              currentState.counts = this.counts;
              this.updateHeaderCounts();
            }
            return;
          }

          this.cards = [...this.cards, ...novosCards];
          this.paginaAtual++;

          // Atualiza o estado específico do status
          currentState.cards = this.cards;
          currentState.pagina = this.paginaAtual;
          currentState.finalDaLista = this.finalDaLista;
          currentState.scrollY = window.scrollY;

          this.counts = response.counts;
          if (offset === 0) {
            currentState.counts = this.counts;
            this.updateHeaderCounts();
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.carregandoMais = false;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.carregandoMais = false;
        },
      });
  }

  renegotiateActive(card?: any): void {
    const cardInfo = this.cards.find((c) => c.id === card.id);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive;
      if (cardInfo.renegotiateActive === true) {
        cardInfo.valor_negociado = cardInfo.valor;
      }
    }
  }

  openCalendar(card: any): void {
    if (!card.calendarActive) {
      this.overlay = true;
      card.calendarActive = true;
    }
  }

  toggleCalendar(card: any, event?: Event) {
    let dateTimeFormatted: string = '';

    if (event) {
      event.stopPropagation();
    }
    card.calendarActive = !card.calendarActive;

    if (card) {
      dateTimeFormatted = moment(card.horario_preferencial).format(
        'DD/MM/YYYY - HH:mm'
      );
      card.placeholderDataHora = dateTimeFormatted;

      if (card.calendarActive === false) {
        card.placeholderDataHora = dateTimeFormatted;
      }
    }
  }

  onCalendarClose(card: any) {
    if (card.placeholderDataHora !== this.dateTimeFormatted) {
      card.calendarActive = true;
    } else {
      card.calendarActive = false;
    }
  }

  onDateSelected(cardId: any, date: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
    }

    if (card) {
      const time = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[1]
        : moment(card.dateTime).format('HH:mm');
      card.placeholderDataHora = `${moment(date).format(
        'DD/MM/YYYY'
      )} - ${time}`;
    }
  }

  onTimeSelected(cardId: any, time: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
    }
    if (card) {
      const date = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[0]
        : moment(card.dateTime).format('DD/MM/YYYY');
      card.placeholderDataHora = `${date} - ${time}`;
    }
  }

  updateHeaderCounts() {
    this.headerPageOptions = [
      `Serviços(${this.counts.publicado})`,
      `Finalizados(${this.counts.finalizado})`,
    ];
  }

  goToBudgets(id_pedido: any): void {
    const currentStatus = 'publicado'; // Ou obtenha o status atual de alguma forma
    const currentState = this.stateManagement.getState(currentStatus);
    currentState.scrollY = window.scrollY;
    this.route.navigate(['/home/budgets'], {
      queryParams: { id: id_pedido, flow: this.flow },
    });
  }

  goToDetails(id_pedido: any): void {
    const currentStatus = 'publicado'; // Ou obtenha o status atual de alguma forma
    const currentState = this.stateManagement.getState(currentStatus);
    currentState.scrollY = window.scrollY;
    currentState.counts = this.counts;

    this.route.navigate(['/home/detail'], {
      queryParams: { id: id_pedido, flow: this.flow },
    });
  }

  changeStatus(newStatus: string) {
    // Limpa os estados atuais antes de carregar um novo status
    this.cards = [];
    this.paginaAtual = 0;
    this.finalDaLista = false;

    // Carrega os cards do novo status
    this.listCards(newStatus);
  }

  flowNavigate(): void {
    let routeSelected: number = 0;
    if (this.homeFlow) {
      switch (this.homeFlow) {
        case 'publicado':
          routeSelected = 0;
          break;
        case 'finalizado':
          routeSelected = 1;
          break;
        default:
          routeSelected = 0;
          break;
      }
      this.selectItem(routeSelected);
      this.cleanActualRoute();
    } else {
      this.selectItem(routeSelected);
    }
  }

  selectItem(index: number): void {
    // Limpa os estados antes de trocar de aba, se necessário
    if (this.selectedIndex !== index) {
      this.cards = []; // Limpa a lista atual
      this.paginaAtual = 0; // Reseta a paginação
      this.finalDaLista = false; // Reseta o flag de final da lista
    }

    this.selectedIndex = index;

    switch (index) {
      case 0:
        this.listCards('publicado');
        this.flow = 'publicado';
        this.cleanActualRoute();
        break;
      case 1:
        this.listCards('finalizado');
        this.flow = 'finalizado';
        this.cleanActualRoute();
        break;
      case 3:
        // Salva o estado atual antes de navegar
        if (this.flow === 'publicado' || this.flow === 'finalizado') {
          const currentState = this.stateManagement.getState(this.flow);
          currentState.scrollY = window.scrollY;
        }
        this.route.navigate(['/tudu-professional/progress']);
        break;
    }
  }

  cleanActualRoute(): void {
    this.route.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        homeFlow: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  formatarHorario(pedido: any): string {
    const candidatura = pedido.candidaturas?.[0];
    let horario = pedido.horario_preferencial;

    if (pedido.data_finalizacao === null) {
      if (
        candidatura &&
        candidatura.horario_negociado !== pedido.horario_preferencial
      ) {
        horario = candidatura.horario_negociado;
      }
    } else {
      horario = pedido.data_finalizacao;
    }

    const data = moment(horario);
    const hoje = moment();

    if (data.isSame(hoje, 'day')) {
      return `Hoje, ${data.format('HH:mm')}`;
    }

    return data.format('DD/MM/YYYY - HH:mm');
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }

  scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.stateManagement.clearState(this.flow); // Limpa o estado ao subir
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const posicao = window.innerHeight + window.scrollY;
    const alturaMaxima = document.body.offsetHeight;

    if (posicao >= alturaMaxima - 200) {
      this.listCards(this.flow); // ou o status atual selecionado
    }
  }
}
