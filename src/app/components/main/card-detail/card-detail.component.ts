import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {

  valorNegociado:any = 250
  servicoMontagemDesmontagem:any = 'Desejo uma montagem e desmontagem do movel'
  imagens:any = [
    '../../../../assets/tradicional1.webp',
    '../../../../assets/tradicional2.webp'
  ]

  @Output() messageEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.sendMessage()
  }

  sendMessage() {
    this.messageEvent.emit('Olá, Pai! Mensagem do Filho 🚀');
  }
}