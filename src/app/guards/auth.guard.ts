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
    const isAuthenticated = isPrestador || isCliente;

    // 🔐 Impedir acesso à rota de login se já estiver autenticado
    if (url === '/login' || url.startsWith('/login')) {
      if (isAuthenticated) {
        // Redirecionar para a página inicial apropriada
        if (isPrestador) {
          this.router.navigate(['/tudu-professional/home']);
        } else {
          this.router.navigate(['/']);
        }
        return false;
      }
      // Permitir acesso à rota de login se não estiver autenticado
      return true;
    }

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
