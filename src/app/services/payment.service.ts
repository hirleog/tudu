import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  calculateInstallments(payload: any) {
    return this.http.post(
      `${environment.apiUrl}/installments/calculate`,
      payload
    );
  }

  // Buscar pagamentos do cliente
  getCharges(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/malga/charges`);
  }

  createToken(cardData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/malga/tokens`, cardData);
  }

  verificarStatusPagamento(
    referenceId: string
  ): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${environment.apiUrl}/status/${referenceId}`
    );
  }
}
