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
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Matheus',
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Guilherme',
      photo: '../../../../assets/GUI.PNG',
      dateTime: '' // Adicionamos esta propriedade
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
