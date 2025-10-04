import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  getPagamentoPorPedido(idPedido: string): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/payments/pedido/${idPedido}`)
      .pipe(
        map((response) => response.data?.[0]) // Pega o primeiro pagamento do array
      );
  }

  // Cancelamento completo
  cancelarPagamento(idPagamento: string, amount?: number): Observable<any> {
    const body: any = amount ? { amount } : {};
    return this.http.post<any>(
      `${environment.apiUrl}/payments/cancelar/${idPagamento}`,
      body
    );
  }

  // Estorno parcial
  estornarParcialmente(idPagamento: string, amount: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/payments/estornar/${idPagamento}`,
      { amount }
    );
  }

  // Consultar status
  consultarStatus(idPagamento: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/payments/status/${idPagamento}`
    );
  }

  // Buscar pagamentos do cliente
  getPagamentosCliente(idCliente: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/payments/cliente/${idCliente}`);
  }


  calculateInstallments(payload: any) {
    return this.http.post(
      `${environment.apiUrl}/installments/calculate`,
      payload
    );
  }

  // Buscar pagamentos do cliente
  getInstallmentsTable(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/installments/table`);
  }



    // Buscar pagamentos do cliente
  getCharges(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/malga/charges`);
  }
}
