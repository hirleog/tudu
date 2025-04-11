import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private idClienteSubject = new BehaviorSubject<string | null>(
    this.getIdClienteFromToken()
  ); // Inicializa com o valor do token

  idCliente: string = '';
  constructor(private http: HttpClient) {}

  // Método para cadastro
  // register(data: {
  //   nome: string;
  //   sobrenome: string;
  //   email: string;
  //   telefone: string;
  //   password: string;
  // }): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/auth/register`, data);
  // }

  // login(email: string, password: string): Observable<any> {
  //   const payload = { email, password };
  //   return this.http.post(`${environment.apiUrl}/auth/login`, payload).pipe(
  //     tap((response: any) => {
  //       // Salva o token no localStorage
  //       localStorage.setItem('access_token', response.access_token);
  //       this.isLoggedInSubject.next(true); // Atualiza o estado de login

  //       // Decodifica o token para obter o id_cliente e atualiza o BehaviorSubject
  //       const idCliente = this.getIdClienteFromToken();
  //       if (idCliente) {
  //         this.setIdCliente(idCliente);
  //       }
  //     })
  //   );
  // }

  login(email: string, password: string, userType: string): Observable<any> {
    const endpoint =
      userType === 'cliente' ? '/auth/login-cliente' : '/auth/login-prestador';
    const payload = { email, password };
    return this.http.post(`${environment.apiUrl}${endpoint}`, payload).pipe(
      tap((response: any) => {
        // Salva o token no localStorage
        localStorage.setItem('access_token', response.access_token);

        // Atualiza o estado de login
        this.isLoggedInSubject.next(true);

        // Decodifica o token para obter o id_cliente e atualiza o BehaviorSubject
        const idCliente = this.getIdClienteFromToken();
        if (idCliente) {
          this.setIdCliente(idCliente);
        }
      })
    );
  }

  register(data: any, userType: string): Observable<any> {
    const endpoint = userType === 'cliente' ? '/clientes' : '/prestadores';
    return this.http.post(`${environment.apiUrl}${endpoint}`, data);
  }

  // Método para obter o token armazenado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Método para remover o token (logout)
  logout(): void {
    localStorage.removeItem('access_token');
    this.isLoggedInSubject.next(false); // Atualiza o estado de login
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Observable para o estado de login
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getIdClienteFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.sub; // Supondo que o idCliente esteja no campo "sub"
    }
    return null;
  }

  // Métodos para gerenciar o idCliente
  setIdCliente(id: string | null): void {
    this.idClienteSubject.next(id);
  }

  get idCliente$(): Observable<string | null> {
    return this.idClienteSubject.asObservable();
  }
}
