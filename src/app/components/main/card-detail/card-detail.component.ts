import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  isModalVisible: boolean = false;

  valorNegociado: any = 250
  servicoMontagemDesmontagem: any = 'Desejo uma montagem e desmontagem do movel'
  imagens: any = [
    '../../../../assets/tradicional1.webp',
    '../../../../assets/tradicional2.webp'
  ]

  @Output() messageEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.sendMessage()
  }

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  editarAnuncio() {
    console.log('Editar anúncio clicado');
    this.closeModal();
  }

  cancelarPedido() {
    console.log('Cancelar pedido clicado');
    this.closeModal();
  }

  falarComAtendente() {
    console.log('Falar com atendente clicado');
    this.closeModal();
  }

  sendMessage() {
    this.messageEvent.emit('Olá, Pai! Mensagem do Filho 🚀');
  }
}