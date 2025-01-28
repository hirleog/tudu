import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { card } from '../../interfaces/card';

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

  serviceCards: card[] = [
    { id: 1, icon: 'fas fa-tools', title: 'Montador de Moveis', disabled: false },
    { id: 2, icon: 'fas fa-home', title: 'Serviços Domésticos', disabled: true },
    { id: 3, icon: 'fas fa-wrench', title: 'Reformas e Reparos', disabled: true },
    { id: 4, icon: 'fas fa-briefcase', title: 'Consultoria', disabled: true },
  ];

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  // Função para selecionar um card
  selectCard(card: any) {
    this.selectedCard = card;
    this.route.navigate(['/proposal', card]);
  }

}
