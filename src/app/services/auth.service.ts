import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://sua-api.com/api'; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  // Método para cadastro
  register(data: {
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response: any) => {
        // Salva o token no localStorage
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  // Método para obter o token armazenado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Método para remover o token (logout)
  logout(): void {
    localStorage.removeItem('access_token');
  }
}
