import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { CardService } from 'src/app/services/card.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthHelper } from '../helpers/auth-helper';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit {
  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [];
  isLogged: boolean = false;

  constructor(
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {
    this.isLogged = AuthHelper.isLoggedIn(); // Usa o helper diretamente
  }

  async ngOnInit() {
    // this.authService.isLoggedIn$.subscribe((loggedIn) => {
    //   this.isLogged = loggedIn;
    // });

    this.serviceCards = this.cardService.getServiceCards();
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
      queryParams: { card: card.cardDetail.label },
    });
  }
}
