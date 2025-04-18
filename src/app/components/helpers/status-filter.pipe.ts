import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus',
})
export class StatusFilterPipe implements PipeTransform {
  transform(cards: any[], selectedIndex: number): any[] {
    if (!cards || cards.length === 0) return [];
    const status = selectedIndex === 0 ? 'publicado' : 'em andamento';
    return cards.filter((card) => card.status_pedido === status);
  }
}
