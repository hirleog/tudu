import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileDetailService {
  constructor(private http: HttpClient) {}

  getPrestadorById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/prestadores/${id}`);
  }

  updatePrestador(id: number, formData: FormData): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/prestadores/${id}`, formData);
  }

  getClienteById(id: number) {
    return this.http.get(`${environment.apiUrl}/clientes/${id}`);
  }

  updateCliente(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}/clientes/${id}`, data);
  }
}
