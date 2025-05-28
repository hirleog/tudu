import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { HistoricModel } from 'src/app/interfaces/historic.model';
import { CardSocketService } from 'src/app/services/card-socket.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
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

  id_prestador: any;
  counts: any;

  constructor(
    private route: Router,
    public cardService: CardService,
    public cardSocketService: CardSocketService
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

    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngAfterViewInit() {}
  ngOnInit(): void {
    console.log('chammou o init');

    this.cardSocketService.ouvirAlertaNovaCandidatura().subscribe((data) => {
      console.log(`Nova candidatura recebida:`, data);

      // this.listCards('publicado');
      const id = data.id_pedido;

      this.cardService.getCardById(id).subscribe({
        next: (data) => {
          const card: any = data;

          // Atualiza o card específico com a nova candidatura
          this.cards = this.cards.map((c) => {
            if (c.id_pedido === id) {
              return {
                ...c,
                candidaturas: [...(c.candidaturas || []), ...card.candidaturas],
                temNovaCandidatura: true, // Marca como novo
              };
            }
            console.log('Card atualizado:', c);
            return c;
          });

          // Marca o card como "novo"
          // this.cards = this.cards.map((card) => {
          //   if (card.id_pedido === id) {
          //     return { ...card, temNovaCandidatura: true };
          //   }
          //   return card;
          // });
        },
        error: (error) => {
          console.error('Erro ao obter o card:', error);
        },
      });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
    this.listCards('publicado');
  }

  listCards(status_pedido: string) {
    this.cardService.getCards(status_pedido).subscribe({
      next: (response: { cards: CardOrders[]; counts: any }) => {
        // Primeiro, acessa os cards corretamente
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

        // Agora acessa os counts (se necessário)
        this.counts = response.counts;

        this.updateHeaderCounts(); // aqui pode usar this.counts.publicado, etc.

        console.log(this.cards);
      },
      error: (error) => console.error('Erro ao obter os cartões:', error),
      complete: () => console.log('Requisição concluída'),
    });
  }

  goToBudgets(id_pedido: any): void {
    this.route.navigate(['/home/budgets'], {
      queryParams: { id: id_pedido },
    });
  }
  goToDetails(id_pedido: any): void {
    this.route.navigate(['/home/detail'], {
      queryParams: { id: id_pedido },
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

  onDateSelected(cardId: any, date: string) {
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

  onTimeSelected(cardId: any, time: string) {
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
    // this.publicados = this.cards.filter(
    //   (card) =>
    //     card.status_pedido === 'publicado' &&
    //     !card.candidaturas?.some((c: any) => c.prestador_id === id)
    // ).length;

    // this.emAndamento = this.cards.filter((card) =>
    //   card.candidaturas?.some((c: any) => c.prestador_id === id)
    // ).length;

    // this.finalizados = this.cards.filter(
    //   (card) => card.status_pedido === 'finalizado'
    // ).length;

    this.headerPageOptions = [
      `Serviços(${this.counts.publicado})`,
      // `Em andamento(${this.counts.andamento})`,
      `Finalizados(${this.counts.finalizado})`,
    ];
  }

  selectItem(index: number): void {
    // Evita reprocessamento se já estiver selecionado
    if (this.selectedIndex === index) return;

    this.selectedIndex = index;

    switch (index) {
      case 0:
        this.listCards('publicado');
        break;
      case 1:
        this.listCards('finalizado');
        break;
    }
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

  // Método para quando o carrossel muda via navegação
  onSlideChanged(event: any) {
    this.selectedIndex = event.to;
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
