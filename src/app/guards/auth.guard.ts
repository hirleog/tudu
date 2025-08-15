import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url = state.url;
    const isPrestador = this.authService.isPrestadorLoggedIn();
    const isCliente = this.authService.isClienteLoggedIn();

    // Redirecionamento baseado no tipo de usuário logado
    if (url === '/') {
      if (isPrestador && !isCliente) {
        this.router.navigate(['/tudu-professional/home']);
        return false;
      }
      // Para outros casos (apenas cliente ou ambos), mantém na rota '/'
      return true;
    }

    if (url.startsWith('/tudu-professional')) {
      // Fluxo exclusivo de prestador
      if (isPrestador) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    if (url.startsWith('/profile')) {
      // Fluxo compartilhado: cliente ou prestador pode acessar
      if (isCliente || isPrestador) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Fluxo padrão do cliente
    if (isCliente) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
