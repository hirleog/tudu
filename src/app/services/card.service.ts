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

  public serviceCards: card[] = [
    {
      id: 1,
      icon: 'fas fa-tools',
      cardDetail: {
        label: 'Serviços de Manutenção',
        value: 'manutencao',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-paint-roller',
      cardDetail: {
        label: 'Pintura Residencial',
        value: 'pintura',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-home',
      cardDetail: {
        label: 'Limpeza e Conservação',
        value: 'limpeza',
      },
      disabled: true,
    },
    {
      id: 3,
      icon: 'fas fa-wrench',
      cardDetail: {
        label: 'Reformas e Reparos',
        value: 'reformas',
      },
      disabled: true,
    },
    {
      id: 4,
      icon: 'fas fa-briefcase',
      cardDetail: {
        label: 'Consultoria',
        value: 'consultoria',
      },
      disabled: true,
    },
  ];

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
  getCardById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.get(`${this.url}/cards/${id}`, { headers });
  }

  // Método para buscar o ícone com base no label
  getIconByLabel(label: string): string | null {
    const card = this.serviceCards.find(
      (card) => card.cardDetail.label === label
    );
    return card ? card.icon : null; // Retorna o ícone ou null se não encontrado
  }
  getServiceCards(): card[] {
    return this.serviceCards;
  }
}
