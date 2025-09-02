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

    // 🔐 NOVA CONDIÇÃO: Bloquear acesso à rota de login se já estiver autenticado
    // if (url.includes('/login')) {
    // if (isCliente && !url.includes('professional')) {
    //   // Cliente logado tentando acessar login → redirecionar para /home
    //   this.router.navigate(['/home']);
    //   return false;
    // } else if (isCliente && url.includes('professional')) {
    //   // Cliente logado tentando acessar login COM 'professional' na URL → redirecionar para área do cliente
    //   this.router.navigate(['/login']);
    //   return true;
    // } else if (isPrestador && url.includes('professional')) {
    //   // Prestador logado tentando acessar login COM 'professional' na URL → redirecionar para área profissional
    //   this.router.navigate(['/tudu-professional/home']);
    //   return false;
    // } else if (isPrestador && !url.includes('professional')) {
    //   // Prestador logado mas URL NÃO contém 'professional' → PERMITIR acesso ao login
    //   return true;
    // }

    // // Se não estiver autenticado (nem cliente nem prestador), permitir acesso
    // return true;
    // }

    if (url.includes('/login')) {
      // Parse a URL para verificar query parameters de forma mais precisa
      const parsedUrl = this.router.parseUrl(url);
      const queryParam = parsedUrl.queryParams['param'];
      const isProfessionalContext =
        queryParam === 'professional' ||
        url.includes('/tudu-professional/login') ||
        url.includes('professional');

      console.log(
        'URL:',
        url,
        'Query param:',
        queryParam,
        'isProfessionalContext:',
        isProfessionalContext
      );

      // 🔐 AMBOS logados → BLOQUEIA qualquer acesso a login
      if (isCliente && isPrestador) {
        // Redireciona para a home do cliente como padrão
        // Ou pode escolher redirecionar para outra rota específica
        this.router.navigate(['/home']);
        return false;
      }

      // CLIENTE logado (apenas cliente)
      if (isCliente && !isPrestador) {
        if (isProfessionalContext) {
          return true; // Permite acesso ao login professional
        } else {
          this.router.navigate(['/home']);
          return false; // Bloqueia login normal
        }
      }

      // PRESTADOR logado (apenas prestador)
      if (isPrestador && !isCliente) {
        if (isProfessionalContext) {
          // Prestador logado tentando acessar login professional → BLOQUEAR
          this.router.navigate(['/tudu-professional/home']);
          return false;
        } else {
          // Prestador logado tentando acessar login normal → PERMITIR
          return true;
        }
      }

      return true; // Usuário deslogado
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
        this.router.navigate(['/login'], {
          queryParams: { param: 'professional' },
        });
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
