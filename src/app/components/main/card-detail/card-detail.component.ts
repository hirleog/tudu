import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  isModalVisible: boolean = false;
  currentImageIndex?: number;
  activeAccordion: string | null = null;

  valorNegociado: any = 250;
  servicoMontagemDesmontagem: any =
    'Desejo uma montagem e desmontagem do movel';

  @Output() messageEvent = new EventEmitter<any>();
  id_pedido: string = '';
  cards: CardOrders[] = [];
  flow: string = '';
  questionTitle: string = '';
  backIndicator: any;
  isProfessionalIndicator: boolean = false;
  id_prestador!: string | null;
  temCandidaturaDoPrestadorLogado: any;

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

    this.isProfessionalIndicator = this.authService.isPrestadorLoggedIn();

    this.authService.idPrestador$.subscribe((id_prestador) => {
      this.id_prestador = id_prestador;
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.sendMessage();

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

  getCardById(): void {
    this.cardService.getCardById(this.id_pedido, this.id_prestador).subscribe({
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

        this.temCandidaturaDoPrestadorLogado = this.cards[0].candidaturas.find(
          (candidatura: any) => candidatura.prestador_id === this.id_prestador
        );
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
    if (this.isProfessionalIndicator) {
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
      } else {
        this.route.navigate([progressRoute], {
          queryParams: { homeFlow: this.flow },
        });
      }

      if (this.flow === 'historic') {
        this.route.navigate([historicRoute]);
        return;
      } else {
        this.route.navigate([historicRoute], {
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

  sendMessage() {
    this.messageEvent.emit('Olá, Pai! Mensagem do Filho 🚀');
  }
}
