import { Injectable } from '@angular/core';
import { CardOrders } from '../interfaces/card-orders';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  cards: CardOrders[] | null = null;
  counts: any = null;
  scrollY: number = 0;

  constructor() {}

  clearState() {
    this.cards = null;
    this.counts = null;
    this.scrollY = 0;
  }
}
