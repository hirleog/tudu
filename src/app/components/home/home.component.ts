import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  serviceCards = [
    {
      icon: 'fas fa-laptop-code',
      title: 'Design e Tecnologia',
      description: 'Serviços criativos e tecnológicos para você.'
    },
    {
      icon: 'fas fa-broom',
      title: 'Serviços Domésticos',
      description: 'Cuidamos da sua casa com dedicação.'
    },
    {
      icon: 'fas fa-tools',
      title: 'Reformas e Reparos',
      description: 'Transformamos seus espaços com qualidade.'
    },
    {
      icon: 'fas fa-user-tie',
      title: 'Consultoria',
      description: 'Orientação especializada para o seu negócio.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
