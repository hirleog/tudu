import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { CardService } from 'src/app/services/card.service';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [];

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;

  private authSubscription: Subscription = new Subscription();

  constructor(
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.serviceCards = this.cardService.getServiceCards();

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
    this.selectedCard = card;

    this.route.navigate(['/proposal'], {
      queryParams: { cardTitle: card.cardDetail.label },
    });
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar vazamentos de memória
    this.authSubscription.unsubscribe();
  }
}
