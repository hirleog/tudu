import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  isModalVisible: boolean = false;
  currentImageIndex?: number;

  valorNegociado: any = 250;
  servicoMontagemDesmontagem: any =
    'Desejo uma montagem e desmontagem do movel';

  @Output() messageEvent = new EventEmitter<any>();
  id_pedido: string = '';
  cards: CardOrders[] = [];
  flow: string = '';

  constructor(
    public cardService: CardService,
    private routeActive: ActivatedRoute,
    private route: Router,
    private location: Location
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
      this.flow = params['flow'];
    });
  }

  ngOnInit(): void {
    this.sendMessage();
    this.getCardById();

    this.location.subscribe(() => {
      this.back(); // chama seu método back() quando clicar em voltar do navegador
    });
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
      },
      error: (err) => {
        console.error(err);
      },
    });
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
    const route =
      this.flow === 'progress'
        ? '/home/progress'
        : '/home';

    if (this.flow === 'progress') {
      this.route.navigate([route]);
    } else {
      this.route.navigate([route], {
        queryParams: { homeFlow: this.flow },
      });
    }
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
