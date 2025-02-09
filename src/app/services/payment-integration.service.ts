import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentIntegrationService {

  private apiUrl = 'http://localhost:3000/create-preference'; // URL do backend

  constructor(private http: HttpClient) { }

  // Método para criar uma preferência de pagamento
  createPaymentPreference(amount: number, description: string): Observable<any> {
    const body = {
      title: description,
      unit_price: amount,
      quantity: 1
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
