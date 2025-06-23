import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:3001/payments';

  constructor(private http: HttpClient) {}

  pagarComCartao(dados: any) {
    return this.http.post(`${environment.apiUrl}/payments/credit`, dados);
  }
}
