import { Injectable } from '@angular/core';
import { CardOrders } from '../interfaces/card-orders';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  private states: {
    [status: string]: {
      cards: CardOrders[];
      counts: any;
      scrollY: number;
      pagina: number;
      finalDaLista: boolean;
    };
  } = {};

  getState(status: string) {
    if (!this.states[status]) {
      this.clearState(status);
    }
    return this.states[status];
  }

  setState(
    status: string,
    state: {
      cards: CardOrders[];
      counts: any;
      scrollY: number;
      pagina: number;
      finalDaLista: boolean;
    }
  ) {
    this.states[status] = state;
  }

  clearState(status: string) {
    this.states[status] = {
      cards: [],
      counts: null,
      scrollY: 0,
      pagina: 0,
      finalDaLista: false,
    };
  }
  clearAllState() {
    const statuses = ['andamento', 'finalizado', 'publicado', 'cancelado', 'pendente'];

    statuses.forEach((status) => {
      this.clearState(status);
    });
  }
}
