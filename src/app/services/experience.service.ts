import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor(private http: HttpClient) {}

  createExperience(experienceData: any, files: File[]): Observable<any> {
    const formData = new FormData();

    // ✅ 1. Envia o objeto experienceData como JSON string no campo 'experienceData'
    formData.append('experienceData', JSON.stringify(experienceData));

    // ✅ 2. Envia as imagens com o campo 'imagens' (mesmo nome do interceptor no backend)
    files.forEach((file) => {
      formData.append('imagens', file, file.name);
    });

    return this.http.post(`${environment.apiUrl}/experiencias`, formData);
  }

  // Método para atualizar experiência (se necessário)
  updateExperience(
    id: number,
    experienceData: any,
    files: File[]
  ): Observable<any> {
    const formData = new FormData();

    formData.append('experienceData', JSON.stringify(experienceData));

    files.forEach((file) => {
      formData.append('imagens', file, file.name);
    });

    return this.http.patch(
      `${environment.apiUrl}/experiencias/${id}`,
      formData
    );
  }

  // Método para adicionar imagens a uma experiência existente
  addExperienceImages(experienceId: number, files: File[]): Observable<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('imagens', file, file.name);
    });

    return this.http.post(
      `${environment.apiUrl}/experiencias/${experienceId}/imagens`,
      formData
    );
  }

  // Outros métodos para gerenciar experiências
  getExperiencesByPrestador(prestadorId: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/experiencias/prestador/${prestadorId}`
    );
  }

  getExperienceById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/experiencias/${id}`);
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/experiencias/${id}`);
  }

  deleteExperienceImage(imageId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/experiencias/imagem/${imageId}`
    );
  }
}
