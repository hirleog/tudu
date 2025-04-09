import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit {
  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [];

  constructor(private route: Router, public cardService: CardService) {}

  async ngOnInit() {
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
