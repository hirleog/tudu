import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MalgaPaymentResponse } from '../malga/service/malga.service';

@Injectable({
  providedIn: 'root',
})
export class PagbankService {
  constructor(private http: HttpClient) {}

  createPixCharge(pixData: any): Observable<any> {
    // O backend agora espera apenas o reference_id
    const payload = {
      reference_id: pixData.reference_id,
      totalWithTax: pixData.totalWithTax,
    };

    return this.http.post(
      `${environment.apiUrl}/pagseguro/orders/pix`,
      payload
    );
  }

  statusPaymentVerify(idPagamento: string) {
    return this.http.get<{ status: string }>(
      `${environment.apiUrl}/pagseguro/pix/status/${idPagamento}`
    );
  }

  cancelPixPayment(
    chargeId: string,
    payload: { amount?: number }
  ): Observable<any> {
    // ⚠️ ATENÇÃO: Ajuste a URL do endpoint para bater no novo método do seu NestJS
    return this.http.post<any>(
      `${environment.apiUrl}/pagseguro/${chargeId}/pix-cancel`, // Exemplo de endpoint ajustado
      payload // O payload continua o mesmo para enviar o amount (opcional)
    );
  }
}
