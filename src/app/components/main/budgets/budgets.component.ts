import { Component, OnInit } from '@angular/core';
import { Budget } from 'src/app/interfaces/budgets';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [
    {
      id: 1,
      photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
      name: 'Aline',
      rate: '4',
      serviceComplete: '66',
      price: '39.45',
      distance: '1.5',
      distanceMinutes: '60'
    },
    {
      id: 2,
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      name: 'Matheus',
      rate: '5',
      serviceComplete: '15',
      price: '45.54',
      distance: '1.0',
      distanceMinutes: '8'
    },
    {
      id: 3,
      photo: '../../../../assets/GUI.PNG',
      name: 'Guilherme',
      rate: '3',
      serviceComplete: '234',
      price: '33.00',
      distance: '4.6',
      distanceMinutes: '24'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}