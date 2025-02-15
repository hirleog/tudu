import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/app/interfaces/progress-card';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  cards: ProgressCard[] = [
    {
      name: 'Aline',
      photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Pintura Residencial',
      status: 'Aguardando prestador',
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Matheus',
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 15:00 - 15:30',
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Guilherme',
      photo: '../../../../assets/GUI.PNG',
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 12:20 - 15:00',
      dateTime: '' // Adicionamos esta propriedade
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
