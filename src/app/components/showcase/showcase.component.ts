import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  selectedCard: any | null = null;
  searchValue: string = '';

  serviceCards: any[] = [];

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;
  showModal: boolean = false;
  skeletonLoader: boolean = false;

  private authSubscription: Subscription = new Subscription();

  constructor(
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {
    this.loadCards();
  }

  async ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.authSubscription = combineLatest([
      this.authService.isPrestadorLoggedIn$,
      this.authService.isClienteLoggedIn$,
    ]).subscribe(([prestadorLoggedIn, clienteLoggedIn]) => {
      this.prestadorIsLogged = prestadorLoggedIn;
      this.clienteIsLogged = clienteLoggedIn;

      // Lógica de redirecionamento
      if (prestadorLoggedIn && !clienteLoggedIn) {
        this.route.navigate(['/tudu-professional/home']);
      }
      // Nos outros casos (apenas cliente ou ambos), mantém na rota atual
    });
  }

  loadCards() {
    this.skeletonLoader = true;
    this.cardService.getShowcaseCards().subscribe({
      next: (res) => {
        this.serviceCards = res.cards;
        this.skeletonLoader = false;
      },
      error: (err) => {
        console.error('Error fetching showcase cards:', err);
        this.skeletonLoader = false;
      },
    });
  }

  goToProfessional() {
    if (this.prestadorIsLogged) {
      this.route.navigate(['/tudu-professional/home']);
    } else {
      this.route.navigate(['/login'], {
        queryParams: { param: 'professional' },
      });
    }
  }

  search() {
    if (this.searchValue.trim()) {
      console.log('Você pesquisou por:', this.searchValue);
    }
  }

  // Função para selecionar um card
  selectCard(card: any) {
    if (card.disabled) {
      this.customModal.openModal();
      this.customModal.configureModal(
        'warning',
        'Você já possui um pedido em andamento. Finalize-o para criar um novo.'
      );
      this.selectedCard = card;
    } else {
      this.selectedCard = card;

      this.route.navigate(['/proposal'], {
        queryParams: { cardTitle: card.cardDetail.label },
      });
    }
  }

  handleModalAction(event: any) {
    this.route.navigate(['home/detail'], {
      queryParams: {
        id: this.selectedCard?.pedidos_ativos[0]?.id_pedido,
        flow: 'publicado',
      },
    });
    this.showModal = false;
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar vazamentos de memória
    this.authSubscription.unsubscribe();
  }
}
