import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { CardService } from 'src/app/services/card.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthHelper } from '../helpers/auth-helper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit {
  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [];

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;

  private subscriptionCliente: Subscription = new Subscription();
  private subscriptionPrestador: Subscription = new Subscription();

  constructor(
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {
    // this.isLogged = AuthHelper.isLoggedIn(); // Usa o helper diretamente
  }

  async ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.serviceCards = this.cardService.getServiceCards();

    // this.subscriptionPrestador.add(
    this.authService.isPrestadorLoggedIn$.subscribe((loggedIn) => {
      this.prestadorIsLogged = loggedIn;
    });
    // );
    // this.subscriptionCliente.add(
    this.authService.isClienteLoggedIn$.subscribe((loggedIn) => {
      this.clienteIsLogged = loggedIn;
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
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
