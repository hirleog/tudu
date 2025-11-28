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

    console.log('AuthGuard - Redirecionamento detectado:', {
      url: state.url,
      clienteLogged: this.authService.isClienteLoggedIn(),
      prestadorLogged: this.authService.isPrestadorLoggedIn(),
      isProfessionalUrl: state.url.includes('professional'),
    });

    // ✅ PERMITIR login sempre
    if (url.includes('/login')) {
      return true;
    }

    // ✅ ROTAS COMPARTILHADAS (acessíveis por ambos)
    const sharedRoutes = ['/home/detail', '/profile', 'notifications'];
    if (sharedRoutes.some((route) => url.includes(route))) {
      if (isCliente || isPrestador) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
    // ROTAS EXCLUSIVAS DO PRESTADOR
    if (url.startsWith('/tudu-professional')) {
      if (isPrestador) return true;
      this.router.navigate(['/login'], {
        queryParams: { param: 'professional' },
      });
      return false;
    }

    // ROTAS EXCLUSIVAS DO CLIENTE
    if (url.startsWith('/')) {
      // 👈 troquei para rota de cliente
      if (isCliente) return true;
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ Rota não reconhecida → trata como compartilhada
    if (isCliente || isPrestador) return true;

    this.router.navigate(['/login']);
    return false;
  }
}
