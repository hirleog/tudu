// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'filterByStatus',
// })
// export class StatusFilterPipe implements PipeTransform {
//   transform(cards: any[], selectedIndex: number, id_prestador: string): any[] {
//     if (!cards || !id_prestador) return [];

//     const id = Number(id_prestador);

//     switch (selectedIndex) {
//       case 0: // Aba "Publicado"
//         return cards.filter(
//           (card) =>
//             card.status_pedido === 'publicado' &&
//             !card.candidaturas?.some((c: any) => c.prestador_id === id)
//         );

//       case 1: // Aba "Em andamento"
//         // return cards.filter((card) =>
//         //   card.candidaturas?.some((c: any) => c.prestador_id === id)
//         // );
//        return cards.filter(
//           (card) =>
//             card.status_pedido === 'andamento' &&
//             !card.candidaturas?.some((c: any) => c.prestador_id === id)
//         );
//       case 2: 
//         return cards.filter((card) => card.status_pedido === 'finalizado');

//       default:
//         return cards;
//     }
//   }
// }
