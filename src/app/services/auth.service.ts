import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isClienteLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isPrestadorLoggedInSubject = new BehaviorSubject<boolean>(false);
  private idClienteSubject = new BehaviorSubject<string | null>(null);
  private idPrestadorSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Atualiza os estados iniciais com base no localStorage
    this.updateLoginStates();
  }
  private updateLoginStates(): void {
    const clienteToken = localStorage.getItem('access_token_cliente');
    const prestadorToken = localStorage.getItem('access_token_prestador');

    if (clienteToken) {
      const idCliente = this.getIdFromToken('cliente');
      if (idCliente) localStorage.setItem('cliente_id', idCliente);

      this.isClienteLoggedInSubject.next(true);
      this.idClienteSubject.next(idCliente);
    } else {
      this.isClienteLoggedInSubject.next(false);
      this.idClienteSubject.next(null);
      localStorage.removeItem('cliente_id');
    }

    if (prestadorToken) {
      const idPrestador = this.getIdFromToken('prestador');
      if (idPrestador) localStorage.setItem('prestador_id', idPrestador);

      this.isPrestadorLoggedInSubject.next(true);
      this.idPrestadorSubject.next(idPrestador);
    } else {
      this.isPrestadorLoggedInSubject.next(false);
      this.idPrestadorSubject.next(null);
      localStorage.removeItem('prestador_id');
    }
  }

  login(email: string, password: string, userType: string): Observable<any> {
    const endpoint =
      userType === 'cliente' ? '/auth/login-cliente' : '/auth/login-prestador';
    const payload = { email, password };
    return this.http.post(`${environment.apiUrl}${endpoint}`, payload).pipe(
      tap((response: any) => {
        if (userType === 'cliente') {
          localStorage.setItem('access_token_cliente', response.access_token);
          localStorage.setItem('role_cliente', response.role);
        } else if (userType === 'prestador') {
          localStorage.setItem('access_token_prestador', response.access_token);
          localStorage.setItem('role_prestador', response.role);
        }

        // Atualiza os estados de login e IDs com base no tipo de usuário
        this.updateLoginStates();
      })
    );
  }

  register(data: any, userType: string): Observable<any> {
    const endpoint = userType === 'cliente' ? '/clientes' : '/prestadores';
    return this.http.post(`${environment.apiUrl}${endpoint}`, data);
  }

  logoutCliente(): void {
    localStorage.removeItem('access_token_cliente');
    localStorage.removeItem('role_cliente');
    this.isClienteLoggedInSubject.next(false);
    this.idClienteSubject.next(null);

    // this.isPrestadorLoggedInSubject.next(false);
    // this.idPrestadorSubject.next(null);
  }

  logoutPrestador(): void {
    localStorage.removeItem('access_token_prestador');
    localStorage.removeItem('role_prestador');
    this.isPrestadorLoggedInSubject.next(false);
    this.idPrestadorSubject.next(null);
  }

  isClienteLoggedIn(): boolean {
    return (
      !!localStorage.getItem('access_token_cliente') && !!this.getRoleCliente()
    );
  }

  isPrestadorLoggedIn(): boolean {
    return (
      !!localStorage.getItem('access_token_prestador') &&
      !!this.getRolePrestador()
    );
  }
  // Métodos para verificar se ambos estão logados
  areBothLoggedIn(): boolean {
    return this.isClienteLoggedIn() && this.isPrestadorLoggedIn();
  }

  // Observables para os estados de login
  get isClienteLoggedIn$(): Observable<boolean> {
    return this.isClienteLoggedInSubject.asObservable();
  }

  get isPrestadorLoggedIn$(): Observable<boolean> {
    return this.isPrestadorLoggedInSubject.asObservable();
  }

  // Métodos para gerenciar IDs
  setIdCliente(id: string | null): void {
    this.idClienteSubject.next(id);
  }

  get idCliente$(): Observable<string | null> {
    return this.idClienteSubject.asObservable();
  }

  setIdPrestador(id: string | null): void {
    this.idPrestadorSubject.next(id);
  }

  get idPrestador$(): Observable<string | null> {
    return this.idPrestadorSubject.asObservable();
  }

  // Métodos auxiliares
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRoleCliente(): string | null {
    return localStorage.getItem('role_cliente');
  }

  getRolePrestador(): string | null {
    return localStorage.getItem('role_prestador');
  }
  getIdFromToken(userType: string): string | null {
    const token =
      userType === 'cliente'
        ? localStorage.getItem('access_token_cliente')
        : localStorage.getItem('access_token_prestador');

    if (token) {
      const decoded: any = jwtDecode(token);

      if (userType === 'prestador') {
        localStorage.setItem('prestador_id', decoded.sub);
      }

      return decoded.sub;
    }

    return null;
  }
}
