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

    if (url.startsWith('/tudu-professional')) {
      // Fluxo exclusivo de prestador
      if (this.authService.isPrestadorLoggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    if (url.startsWith('/profile')) {
      // Fluxo compartilhado: cliente ou prestador pode acessar
      if (
        this.authService.isClienteLoggedIn() ||
        this.authService.isPrestadorLoggedIn()
      ) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Fluxo padrão do cliente
    if (this.authService.isClienteLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
