import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  isModalVisible: boolean = false;

  valorNegociado: any = 250;
  servicoMontagemDesmontagem: any =
    'Desejo uma montagem e desmontagem do movel';
  imagens: any = [
    '../../../../assets/tradicional1.webp',
    '../../../../assets/tradicional2.webp',
  ];

  @Output() messageEvent = new EventEmitter<any>();
  id_pedido: string = '';
  cards: CardOrders[] = [];

  constructor(
    public cardService: CardService,
    private routeActive: ActivatedRoute,
    private profileDetailService: ProfileDetailService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
    });
  }

  ngOnInit(): void {
    this.sendMessage();
    this.getCardById();
  }

  getCardById(): void {
    this.cardService.getCardById(this.id_pedido).subscribe({
      next: (data: any) => {
        const candidaturas = data.candidaturas || [];

        // Primeiro monta o card com ícone e candidaturas
        this.cards.push({
          ...data,
          icon: this.cardService.getIconByLabel(data.categoria) || '',
          candidaturas: candidaturas.map((candidatura: any) => ({
            ...candidatura,
            icon: this.cardService.getIconByLabel(data.categoria) || '',
          })),
        });

        // Prepara as chamadas para os prestadores
        // const chamadasPrestadores = this.cards.candidaturas
        //   .filter((c: any) => c.prestador_id)
        //   .map((c: any) =>
        //     this.profileDetailService.getPrestadorById(c.prestador_id)
        //   );

        // // Aguarda todas as chamadas e insere as infos
        // forkJoin(chamadasPrestadores).subscribe((prestadoresInfos: any) => {
        //   this.cards.candidaturas.forEach((candidatura: any, index: any) => {
        //     candidatura.prestador_info = prestadoresInfos[index];
        //   });

        //   console.log('Cards com informações dos prestadores:', this.cards);
        // });
      },
      error: (err) => {
        console.error(err);
      },
    });
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

  cancelarPedido() {
    console.log('Cancelar pedido clicado');
    this.closeModal();
  }

  falarComAtendente() {
    console.log('Falar com atendente clicado');
    this.closeModal();
  }

  sendMessage() {
    this.messageEvent.emit('Olá, Pai! Mensagem do Filho 🚀');
  }
}
