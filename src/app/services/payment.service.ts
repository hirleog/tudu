import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:3001/payments';

  constructor(private http: HttpClient) {}

  pagarComCartao(dados: any) {
    return this.http.post(`${this.baseUrl}/credit`, dados);
  }
}
