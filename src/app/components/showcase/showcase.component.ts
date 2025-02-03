import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css'],
})
export class ShowcaseComponent implements OnInit {

  selectedCard: number | null = null;
  searchValue: string = '';

  serviceCards: card[] = [
    { id: 1, icon: 'fas fa-tools', title: 'Montador de Moveis', disabled: false },
    { id: 2, icon: 'fas fa-home', title: 'Serviços Domésticos', disabled: true },
    { id: 3, icon: 'fas fa-wrench', title: 'Reformas e Reparos', disabled: true },
    { id: 4, icon: 'fas fa-briefcase', title: 'Consultoria', disabled: true },
  ];

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  search() {
    if (this.searchValue.trim()) {
      console.log('Você pesquisou por:', this.searchValue);
      // Aqui você pode implementar a lógica para buscar os serviços
    }
  }

  // Função para selecionar um card
  selectCard(card: any) {
    this.selectedCard = card;
    this.route.navigate(['proposal', card]);
  }
}