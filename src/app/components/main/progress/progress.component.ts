import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  card: CardOrders[] = [];
  candidatura: any;
  prestadorInfos: any;

  // cards: ProgressCard[] = [
  //   {
  //     name: 'Aline',
  //     photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
  //     icon: 'fa-paint-brush',
  //     service: 'Pintura Residencial',
  //     status: 'Aguardando prestador',
  //     dateTime: '', // Adicionamos esta propriedade
  //   },
  //   {
  //     name: 'Matheus',
  //     photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
  //     icon: 'fa-paint-brush',
  //     service: 'Lavagem de Automotiva',
  //     status: 'Hoje, 15:00 - 15:30',
  //     dateTime: '', // Adicionamos esta propriedade
  //   },
  //   {
  //     name: 'Guilherme',
  //     photo: '../../../../assets/GUI.PNG',
  //     icon: 'fa-paint-brush',
  //     service: 'Lavagem de Automotiva',
  //     status: 'Hoje, 12:20 - 15:00',
  //     dateTime: '', // Adicionamos esta propriedade
  //   },
  // ];

  constructor(
    private profileDetailService: ProfileDetailService,
    private route: Router,
    public cardService: CardService
  ) {}

  ngOnInit() {
    this.listCards();
  }

  listCards() {
    this.cardService.getCards('pendente').subscribe({
      next: (response) => {
        // Primeiro, acessa os cards corretamente
        this.card = response.cards.map((card) => ({
          ...card,
          icon: this.cardService.getIconByLabel(card.categoria) || '',
          renegotiateActive: !card.valor_negociado,
          calendarActive: false,
        }));

        this.candidatura = response.cards.flatMap((card) =>
          card.candidaturas.map((candidatura) => ({
            ...candidatura,
            icon: this.cardService.getIconByLabel(card.categoria) || '',
            renegotiateActive: !candidatura.valor_negociado,
            calendarActive: false,
          }))
        );
        this.loadPrestador(this.candidatura[0].prestador_id);
      },
      error: (error) => console.error('Erro ao obter os cartões:', error),
      complete: () => console.log('Requisição concluída'),
    });
  }

  loadPrestador(id_prestador: number): void {
    this.profileDetailService
      .getPrestadorById(id_prestador)
      .subscribe((data: any) => {
        this.prestadorInfos = data;
      });
  }

  formatarHorario(pedido: any): string {
    const candidatura = pedido.candidaturas?.[0];
    let horario = pedido.horario_preferencial;

    if (
      candidatura &&
      candidatura.horario_negociado !== pedido.horario_preferencial
    ) {
      horario = candidatura.horario_negociado;
    }

    const data = moment(horario);
    const hoje = moment();

    if (data.isSame(hoje, 'day')) {
      return `Hoje, ${data.format('HH:mm')}`;
    }

    return data.format('DD/MM/YYYY - HH:mm');
  }

  goToDetails(idPedido: any): void {
    this.route.navigate(['home/progress-detail'], {
      queryParams: { id: idPedido },
    });
  }
}
