import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

  cards: CardOrders[] = [
    {
      id: 101,
      icon: 'fas fa-tools', // Ícone FontAwesome
      serviceName: 'Reparo Hidráulico',
      description: 'Preciso de um encanador para consertar um vazamento na cozinha...',
      address: 'Rua das Flores, 123',
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: true
    },
    {
      id: 102,
      icon: 'fas fa-car', // Ícone FontAwesome
      serviceName: 'Lavagem Automotiva',
      description: 'Lavagem completa com polimento para meu carro...',
      address: 'Rua doutor paulo de andrade arantes, 52',
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: false
    },
    {
      id: 103,
      icon: 'fas fa-paint-roller',
      serviceName: 'Pintura Residencial',
      description: 'Preciso pintar a sala e os quartos do apartamento...',
      address: 'Rua doutor antonio lobo sobrinho, 123',
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: true
    }
  ];

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  goToShowcase() {
    this.route.navigate(['/showcase']);
  }

}
