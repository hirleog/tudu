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
    const clienteToken = localStorage.getItem('access_token_cliente');
    const prestadorToken = localStorage.getItem('access_token_prestador');

    let token: string | null = null;

    // Verifica pela URL da requisição se é rota de prestador
    const currentRoute = this.router.url; // ← 🚨 Usa a URL da aplicação
    const isProfessionalRequest =
      currentRoute.includes('professional') ||
      currentRoute.includes('prestador');

    if (isProfessionalRequest && prestadorToken) {
      token = prestadorToken;
    } else if (!isProfessionalRequest && clienteToken) {
      token = clienteToken;
    }

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    console.log('prestadorToken', prestadorToken);
    // Se não houver token, continua a requisição original
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
