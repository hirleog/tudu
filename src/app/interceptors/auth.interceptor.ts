import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clienteToken = localStorage.getItem('access_token_cliente');
    const prestadorToken = localStorage.getItem('access_token_prestador');

    // Clona a requisição com o token apropriado
    let authReq = req;
    if (prestadorToken && this.authService.isPrestadorLoggedIn()) {
      // Se prestador está logado, usa token do prestador
      authReq = this.addTokenHeader(req, prestadorToken);
    } else if (clienteToken && this.authService.isClienteLoggedIn()) {
      // Se cliente está logado, usa token do cliente
      authReq = this.addTokenHeader(req, clienteToken);
    }
    // Se nenhum estiver logado, não adiciona token

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorizedError();
        }
        return throwError(() => error);
      })
    );
  }
  private addTokenHeader(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleUnauthorizedError(): void {
    // Limpa ambos os tokens em caso de 401
    this.authService.logoutAll();
    this.router.navigate(['/login']);
  }
}
