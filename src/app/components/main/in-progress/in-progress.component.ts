import { Component, OnInit } from '@angular/core';
import { InProgressCard } from 'src/app/interfaces/progress-card';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.css']
})
export class InProgressComponent implements OnInit {

  cards: InProgressCard[] = [
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
