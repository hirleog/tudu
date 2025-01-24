import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  selectedCard: number | null = null;

  serviceCards = [
    { id: 1, icon: 'fas fa-cogs', title: 'Design e Tecnologia' },
    { id: 2, icon: 'fas fa-home', title: 'Serviços Domésticos' },
    { id: 3, icon: 'fas fa-wrench', title: 'Reformas e Reparos' },
    { id: 4, icon: 'fas fa-briefcase', title: 'Consultoria' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Função para selecionar um card
  selectCard(cardId: number) {
    this.selectedCard = cardId;
  }

}
