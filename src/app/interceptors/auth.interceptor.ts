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
    const token = this.authService.getToken(); // Recupera o token do AuthService

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
            // Exibe o modal de reautenticação
            // this.dialog.open(ReauthModalComponent, {
            //   width: '400px',
            //   disableClose: true,
            // });

            // Redireciona para a rota de login
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Exibe o modal de reautenticação
          // this.dialog.open(ReauthModalComponent, {
          //   width: '400px',
          //   disableClose: true,
          // });

          // Redireciona para a rota de login
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
