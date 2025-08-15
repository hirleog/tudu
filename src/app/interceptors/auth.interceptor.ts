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

    // Determina o tipo de usuário baseado na rota atual
    const currentRoute = this.router.url;
    const isProfessionalRoute = currentRoute.includes('/tudu-professional');

    // Clona a requisição com o token apropriado
    let authReq = req;
    if (isProfessionalRoute && prestadorToken) {
      authReq = this.addTokenHeader(req, prestadorToken);
    } else if (!isProfessionalRoute && clienteToken) {
      authReq = this.addTokenHeader(req, clienteToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorizedError(isProfessionalRoute);
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

  private handleUnauthorizedError(isProfessionalRoute: boolean): void {
    // Limpa os tokens e estados de autenticação
    this.authService.logout(); // Implemente este método no AuthService se não existir

    // Remove os tokens do localStorage
    localStorage.removeItem('access_token_cliente');
    localStorage.removeItem('access_token_prestador');

    // Redireciona para a tela de login apropriada
    if (isProfessionalRoute) {
      this.router.navigate(['/login'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
