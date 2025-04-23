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
  isProfessional: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Determina qual token usar com base no estado de login
    const clienteToken =
      this.authService.isClienteLoggedIn() &&
      localStorage.getItem('access_token_cliente');
    const prestadorToken =
      this.authService.isPrestadorLoggedIn() &&
      localStorage.getItem('access_token_prestador');

    let token: any = null;

    if (this.isProfessional === true && prestadorToken !== null) {
      token = prestadorToken;
    } else if (this.isProfessional === false && clienteToken !== null) {
      token = clienteToken;
    }

    if (token) {
      // Clona a requisição e adiciona o cabeçalho Authorization
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            // Redireciona para a rota de login
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    // Caso nenhum token esteja disponível, continua a requisição original
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Redireciona para a rota de login
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
