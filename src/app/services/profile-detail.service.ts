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

  updatePrestador(
    id: number,
    prestadorData: any, // Dados do formulário
    file?: File // Arquivo opcional
  ): Observable<any> {
    const formData = new FormData();

    // 1. Adiciona os dados do prestador como JSON
    formData.append('data', JSON.stringify(prestadorData));

    // 2. Adiciona a foto apenas se existir
    if (file) {
      formData.append('foto', file, file.name);
    }

    return this.http.patch(`${environment.apiUrl}/prestadores/${id}`, formData);
  }

  getClienteById(id: number) {
    return this.http.get(`${environment.apiUrl}/clientes/${id}`);
  }

  // updateCliente(id: number, data: any) {
  // return this.http.put(`${environment.apiUrl}/clientes/${id}`, data);
  // }

  updateCliente(
    id: number,
    clienteData: any, // Dados do formulário
    file?: File // Arquivo opcional
  ): Observable<any> {
    const formData = new FormData();

    // 1. Adiciona os dados do prestador como JSON
    formData.append('data', JSON.stringify(clienteData));

    // 2. Adiciona a foto apenas se existir
    if (file) {
      formData.append('foto', file, file.name);
    }

    return this.http.patch(`${environment.apiUrl}/clientes/${id}`, formData);
  }

  addExperiencia(experienciaData: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('experienciaData', JSON.stringify(experienciaData));

    files.forEach((file, index) => {
      formData.append('imagens', file, `imagem-${index}.webp`);
    });

    return this.http.post(`${environment.apiUrl}/experiencias`, formData);
  }
}
