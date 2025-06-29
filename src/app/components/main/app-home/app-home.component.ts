import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardSocketService } from 'src/app/services/card-socket.service';
import { CardService } from 'src/app/services/card.service';
import { Location } from '@angular/common';
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
  isLoading: boolean = true;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    public cardService: CardService,
    public cardSocketService: CardSocketService,
    private location: Location,
    private stateManagement: StateManagementService
  ) {
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

  listCards(status_pedido: string) {
    if (
      this.stateManagement.cards &&
      this.stateManagement.counts &&
      status_pedido === 'publicado'
    ) {
      this.cards = this.stateManagement.cards;
      this.counts = this.stateManagement.counts;
      this.updateHeaderCounts();
      this.isLoading = false;

      setTimeout(() => {
        window.scrollTo({
          top: this.stateManagement.scrollY,
          behavior: 'auto',
        });
      }, 0);
    }

    this.isLoading = true;

    this.cardService.getCards(status_pedido).subscribe({
      next: (response: { cards: CardOrders[]; counts: any }) => {
        this.cards = response.cards.map((card) => {
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

        this.counts = response.counts;
        this.stateManagement.cards = this.cards;
        this.stateManagement.counts = this.counts;
        this.updateHeaderCounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
        this.isLoading = false;
      },
      complete: () => {
        console.log('Requisição concluída');
        this.isLoading = false;
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
    this.stateManagement.scrollY = window.scrollY;
    this.route.navigate(['/home/budgets'], {
      queryParams: { id: id_pedido },
    });
  }

  goToDetails(id_pedido: any): void {
    this.stateManagement.scrollY = window.scrollY;
    this.route.navigate(['/home/detail'], {
      queryParams: { id: id_pedido, flow: this.flow },
    });
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

  goToProgress() {
    // Implementação do método goToProgress
  }
}
