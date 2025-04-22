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
    // Recupera os tokens do AuthService
    const clienteToken = localStorage.getItem('access_token_cliente');
    const prestadorToken = localStorage.getItem('access_token_prestador');

    // Determina qual token usar com base na URL
    const token = req.url.includes('prestador')
      ? prestadorToken
      : clienteToken;

      console.log('Token:', token); // Adicione este log para depuração
      

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
