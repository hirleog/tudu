import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.css'],
})
export class CardLayoutComponent implements OnInit {
  @Input() statusPedido: string = '';

  tags: string[] = ['Residencial', 'Urgente', 'Elétrica'];

  statusOptions = [
    { class: 'status-active', text: 'Ativo', icon: 'fa-circle' },
    { class: 'status-pending', text: 'Em andamento', icon: 'fa-spinner' },
    { class: 'status-completed', text: 'Concluído', icon: 'fa-check' },
    { class: 'status-cancelled', text: 'Cancelado', icon: 'fa-times' },
  ];

  currentStatus = this.statusOptions[0];
  private statusInterval: any;

  ngOnInit() {
    let index = 0;
    this.statusInterval = setInterval(() => {
      index = (index + 1) % this.statusOptions.length;
      this.currentStatus = this.statusOptions[index];
    }, 3000);
  }

  get badgeStyles(): { [key: string]: string } {
    const status = this.statusPedido?.toLowerCase();

    switch (status) {
      case 'finalizado':
        return { backgroundColor: '#4caf5020', color: '#4caf50' }; // verde suave
      case 'concluido':
        return { backgroundColor: '#0096881c', color: '#009688' }; // teal
      case 'cancelado':
        return { backgroundColor: '#ff52521c', color: '#ff5252' }; // vermelho claro
      case 'publicado':
        return { backgroundColor: '#0096ff1c', color: '#25a5ff' }; // azul suave
      default:
        return { backgroundColor: '#e0e0e01c', color: '#757575' }; // cinza padrão
    }
  }

  ngOnDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  verDetalhes() {
    alert('Abrir detalhes do serviço...');
  }
}
