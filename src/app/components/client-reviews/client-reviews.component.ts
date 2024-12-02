import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.css']
})
export class ClientReviewsComponent implements OnInit {

  public cards = [
    {
      name: 'João Silva',
      ocupation: 'Consultor',
      review: '"Ótimo atendimento e o carro ficou impecável! A equipe é muito cuidadosa e atenta aos detalhes. Recomendo demais!"',
      imgSrc: '../../../assets/client2.svg',
    },
    {
      name: 'Maria Oliveira',
      ocupation: 'Designer',
      review: '"Melhor lugar para cuidar do carro! Trabalho de qualidade e agilidade. Superou minhas expectativas!"',
      imgSrc: '../../../assets/review.PNG',
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
