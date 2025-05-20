import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { Budget } from 'src/app/interfaces/budgets';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  cardPrice = '';
  budgets: Budget[] = [
    {
      id: 1,
      photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
      name: 'Aline',
      rate: '4',
      serviceComplete: '66',
      distance: '1.5',
      distanceMinutes: '60',
      price: '39.45',
      editedPrice: '', // Adicionamos esta propriedade
    },
    {
      id: 2,
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      name: 'Matheus',
      rate: '5',
      serviceComplete: '15',
      price: '45.54',
      distance: '1.0',
      distanceMinutes: '8',
      editedPrice: '', // Adicionamos esta propriedade
    },
    {
      id: 3,
      photo: '../../../../assets/GUI.PNG',
      name: 'Guilherme',
      rate: '3',
      serviceComplete: '234',
      price: '33.00',
      distance: '4.6',
      distanceMinutes: '24',
      editedPrice: '', // Adicionamos esta propriedade
    },
  ];
  id_pedido: string = '';
  cards: any;
  id_prestador: any;

  constructor(
    public cardService: CardService,
    private routeActive: ActivatedRoute,
    private route: Router
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
    });

    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
    this.getCardById();
  }

  getCardById(): void {
    this.cardService.getCardById(this.id_pedido).subscribe({
      next: (data) => {
        this.cards = data;

        console.log(this.cards);

        // this.isLoading = false;
      },
      error: (err) => {
        // this.error = 'Erro ao buscar o pedido';
        // this.isLoading = false;
        console.error(err);
      },
    });
  }

  updateCard(card: CardOrders, step: string): Observable<CardOrders> {
    // const horario_negociado_formatted = moment(
    //   card.placeholderDataHora,
    //   'DD/MM/YYYY - HH:mm'
    // ).format('YYYY-MM-DD HH:mm');

    // Obtém a candidatura do prestador atual (se existir)
    const candidaturaAtual = card.candidaturas?.find(
      (c) => c.prestador_id === Number(this.id_prestador)
    );

    // Determina o valor negociado
    const valorNegociado = candidaturaAtual
      ? candidaturaAtual.valor_negociado === ''
        ? card.valor
        : candidaturaAtual.valor_negociado ?? card.valor
      : card.valor_negociado && card.valor_negociado !== card.valor
      ? card.valor_negociado
      : card.valor;

    const horario_negociado = candidaturaAtual
      ? candidaturaAtual.horario_negociado === ''
        ? card.horario_preferencial
        : candidaturaAtual.horario_negociado ?? card.horario_preferencial
      : card.horario_preferencial;

    // Determina o status com base nas negociações
    // const statusPedido =
    //   valorNegociado !== card.valor ||
    //   (horario_negociado_formatted &&
    //     horario_negociado_formatted !== card.horario_preferencial)   
    //     ? 'publicado'
    //     : 'pendente';

    const payloadCard: any = {
      id_cliente: Number(card.id_pedido),
      id_prestador: null,
      categoria: card.categoria,
      status_pedido: step === 'contratar' ? 'pendente' : 'publicado', // Usa o status calculado
      subcategoria: card.subcategoria,
      valor: card.valor,
      horario_preferencial: card.horario_preferencial,

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
          horario_negociado: horario_negociado,
          status: step === 'contratar' ? 'aceito' : 'recusado',
          data_finalizacao: '',
        },
      ],
    };

    //  status: valorNegociado !== card.valor || (horario_negociado_formatted && horario_negociado_formatted !== card.horario_preferencial)
    //         ? 'em negociacao' : 'pendente',

    // const flow =
    //   payloadCard.candidaturas[0].valor_negociado !== payloadCard.valor ||
    //   payloadCard.candidaturas[0].horario_negociado !==
    //     payloadCard.horario_preferencial
    //     ? 'emAndamento'
    //     : 'pendente';

    // const route: string = flow === 'pendente' ? '/progress' : '/home';

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: (response) => {
        step === 'contratar'
          ? this.route.navigate(['/home/progress'])
          : this.getCardById(); // Atualiza a lista de cartões após a atualização
        // route === '/home' ? this.selectItem(1) : this.route.navigate([route]); // direciona para tela de em andamento se não vai para tela de progress
      },
      error: (error) => {
        console.error('Erro ao atualizar o cartão:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
    });

    return of();
    // // if (this.isLogged) {
    // this.cardService
    //   .updateCard(card.id_pedido!, payloadCard) // Use non-null assertion
    //   .subscribe(() => {
    //     route === '/home' ? this.selectItem(1) : this.route.navigate([route]); // Atualiza a lista de cartões após a atualização
    //   });
    // // } else {
    // // this.route.navigate(['/']);
    // return of();
    // // }
  }
}
