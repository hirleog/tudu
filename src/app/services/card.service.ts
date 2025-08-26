import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { card } from '../interfaces/card';
import { CardOrders } from '../interfaces/card-orders';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  url: string = environment.apiUrl;

  public cardsMock: card[] = [
    {
      id: 1,
      icon: 'fas fa-tools',
      cardDetail: {
        label: 'Reparos e Manutenção',
        value: 'reparos',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-broom',
      cardDetail: {
        label: 'Limpeza e Higienização',
        value: 'limpeza',
      },
      disabled: false,
    },
    {
      id: 3,
      icon: 'fas fa-hard-hat',
      cardDetail: {
        label: 'Reformas e Construção',
        value: 'construcao',
      },
      disabled: false,
    },
    {
      id: 4,
      icon: 'fas fa-cogs',
      cardDetail: {
        label: 'Montagem e Instalação',
        value: 'montagem',
      },
      disabled: false,
    },
    {
      id: 5,
      icon: 'fas fa-seedling',
      cardDetail: {
        label: 'Jardim e Piscina',
        value: 'jardim',
      },
      disabled: false,
    },
    {
      id: 6,
      icon: 'fas fa-ellipsis-h',
      cardDetail: {
        label: 'Outros serviços',
        value: 'outros',
      },
      disabled: false,
    },
  ];

  public serviceCards: card[] = [];

  constructor(private http: HttpClient) {}

  postCardWithImages(cardData: any, files: File[]) {
    const formData = new FormData();

    // ✅ 1. Envia o objeto cardData como JSON string no campo 'cardData'
    formData.append('cardData', JSON.stringify(cardData));

    // ✅ 2. Envia as imagens com o campo 'imagens'
    files.forEach((file) => {
      formData.append('imagens', file, file.name);
    });

    return this.http.post(`${environment.apiUrl}/cards`, formData);
  }

  updateCard(
    id: string,
    updatedFields: Partial<CardOrders>
  ): Observable<CardOrders> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'access-control-allow-origin': '*',
    });

    return this.http.put<CardOrders>(`${this.url}/cards/${id}`, updatedFields, {
      headers,
    });
  }

  getCards(status_pedido: string, offset: number = 0, limit: number = 10) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    let params = new HttpParams()
      .set('status_pedido', status_pedido)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.http.get<{ cards: CardOrders[]; counts: any }>(
      `${this.url}/cards`,
      { headers, params }
    );
  }

  cancelCard(cardId: string, reason: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/cards/${cardId}/cancel`, {
      body: { cancellation_reason: reason },
    });
  }

  getCardById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.get(`${this.url}/cards/${id}`, { headers });
  }

  // Método para buscar o ícone com base no label
  getIconByLabel(label: string): string | null {
    const card = this.cardsMock.find((card) => card.cardDetail.label === label);
    return card ? card.icon : null; // Retorna o ícone ou null se não encontrado
  }

  getShowcaseCards() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<{ cards: CardOrders[]; counts: any }>(
      `${this.url}/cards/list/showcase`,
      { headers }
    );
  }
}
