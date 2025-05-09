import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import * as moment from 'moment';
import { HistoricModel } from 'src/app/interfaces/historic.model';
import { Carousel } from 'bootstrap';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  @ViewChild('carouselOrders') carousel: any;
  bsCarousel!: Carousel;

  headerPageOptions: string[] = []; // Lista dinâmica
  overlay: boolean = false;
  dateTimeFormatted: string = '';

  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
  placeholderDataHora: string = '';

  cards: CardOrders[] = [];

  historicOrders: HistoricModel[] = [
    {
      id: 102,
      icon: 'fas fa-car', // Ícone FontAwesome
      serviceName: 'Lavagem Automotiva',
      description: 'Lavagem completa com polimento para meu carro...',
      price: '150,00',
      clientName: 'Guilherme',
      clientPhoto: '../../../../assets/GUI.PNG',
      clientAddress: 'Rua doutor paulo de andrade arantes, 52',
      dateTime: '2021-08-10T10:00:00',
    },
    {
      id: 103,
      icon: 'fas fa-paint-roller',
      serviceName: 'Pintura Residencial',
      description: 'Preciso pintar a sala e os quartos do apartamento...',
      price: '150,00',
      clientName: 'Matheus',
      clientPhoto: '../../../../assets/matheus.PNG',
      clientAddress: 'Rua doutor antonio lobo sobrinho, 123',
      dateTime: '2021-08-10T10:00:00',
    },
  ];

  publicados: number = 0;
  emAndamento: number = 0;
  finalizados: number = 0;
  id_prestador: any;

  constructor(private route: Router, public cardService: CardService) {
    // moment.locale('pt-br');
    // this.placeholderDataHora =
    //   moment().add(1, 'days').format('DD/MM/YYYY') + ' - 12:00'; // Data de amanhã às 12:00

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

    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngAfterViewInit() {
    this.bsCarousel = new Carousel(this.carousel.nativeElement, {
      interval: false,
      touch: true, // Habilita o arrasto
    });
  }
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
    this.listCards();
  }

  listCards() {
    this.cardService.getCards().subscribe({
      next: (response) => {
        this.cards = (response as CardOrders[]).map((card) => ({
          ...card, // Mantém os campos existentes
          icon: this.cardService.getIconByLabel(card.categoria) || '', // Garante que o ícone nunca seja null
          renegotiateActive: true, // Adiciona o campo manualmente
          calendarActive: false, // Adiciona o campo manualmente
          horario_preferencial: card.horario_preferencial, // Usa o valor existente ou um padrão
          placeholderDataHora: '', // Adiciona o campo manualmente
        }));
        this.updateHeaderCounts(); // ATUALIZA A CONTAGEM
        this.selectItem(0);
      },
      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
    });
  }

  renegotiateActive(card?: any): void {
    // this.renegotiate = !this.renegotiate;
    const cardInfo = this.cards.find((c) => c.id === card.id);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive; // Alterna o estado

      if (cardInfo.renegotiateActive === true) {
        cardInfo.valor_negociado = cardInfo.valor;
      }
    }
  }

  // No seu componente TypeScript
  openCalendar(card: any): void {
    if (!card.calendarActive) {
      this.overlay = true;
      card.calendarActive = true;
    }
  }

  // Adicione esta função ao seu componente pai
  toggleCalendar(card: any, event?: Event) {
    let dateTimeFormatted: string = '';

    if (event) {
      event.stopPropagation(); // Impede que o evento chegue ao document.click
    }
    card.calendarActive = !card.calendarActive;

    if (card) {
      // const formattedDate = moment(card.hora).format('DD/MM/YYYY');
      // const formattedTime = moment(card.dateTime).format('HH:mm');
      // dateTimeFormatted = `${formattedDate} - ${formattedTime}`;
      dateTimeFormatted = moment(card.horario_preferencial).format(
        'DD/MM/YYYY - HH:mm'
      );

      card.placeholderDataHora = dateTimeFormatted;

      if (card.calendarActive === false) {
        card.placeholderDataHora = dateTimeFormatted;
      }
    }
  }

  // Adicione este handler para quando o calendário emitir o evento de fechar
  onCalendarClose(card: any) {
    // this.clickOutside = true

    if (card.placeholderDataHora !== this.dateTimeFormatted) {
      card.calendarActive = true;
    } else {
      card.calendarActive = false;
    }
  }

  onDateSelected(cardId: string, date: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
    }

    if (card) {
      const time = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[1]
        : moment(card.dateTime).format('HH:mm'); // Mantém a hora se já existir

      card.placeholderDataHora = `${moment(date).format(
        'DD/MM/YYYY'
      )} - ${time}`;
    }
  }

  onTimeSelected(cardId: string, time: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
    }
    if (card) {
      const date = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[0]
        : moment(card.dateTime).format('DD/MM/YYYY'); // Mantém a data se já existir

      card.placeholderDataHora = `${date} - ${time}`;
    }
  }

  updateHeaderCounts() {
    const id = Number(this.id_prestador);

    this.publicados = this.cards.filter(
      (card) =>
        card.status_pedido === 'publicado' &&
        !card.candidaturas?.some((c: any) => c.prestador_id === id)
    ).length;

    this.emAndamento = this.cards.filter((card) =>
      card.candidaturas?.some((c: any) => c.prestador_id === id)
    ).length;

    this.finalizados = this.cards.filter(
      (card) => card.status_pedido === 'finalizado'
    ).length;

    this.headerPageOptions = [
      `Serviços(${this.publicados})`,
      `Em andamento(${this.emAndamento})`,
      `Finalizados(${this.finalizados})`,
    ];
  }

  selectItem(index: number): void {
    let dateTimeFormatted: string = '';

    if (index >= 0 && index <= 2 && index !== this.selectedIndex) {
      this.selectedIndex = index;
    }

    this.cards.forEach((card) => {
      if (card.horario_preferencial) {
        const formattedDate = moment(card.horario_preferencial).format(
          'DD/MM/YYYY'
        );
        const formattedTime = moment(card.horario_preferencial).format('HH:mm');
        dateTimeFormatted = `${formattedDate} - ${formattedTime}`;
      }

      if (
        this.selectedIndex === 0 ||
        this.selectedIndex === 1 ||
        this.selectedIndex === 2
      ) {
        card.placeholderDataHora = dateTimeFormatted;
        card.calendarActive = false; // desabilita campo de calendario
      }

      if (card.valor_negociado) {
        card.valor_negociado = card.valor;
        card.renegotiateActive = true; // desabilita campo de edição de valor
      }
    });
  }
  // Método para quando o carrossel muda via navegação
  onSlideChanged(event: any) {
    this.selectedIndex = event.to;
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
