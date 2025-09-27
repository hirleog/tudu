import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { StateManagementService } from 'src/app/services/state-management.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css'],
})
export class AppMenuComponent implements OnInit {
  hiddenRoutes = [
    '/login',
    '/proposal',
    '/proposal/address',
    '/proposal/offer',
    '/prestador-institucional',
  ];
  showDiv = true;
  isLogged = false;
  isProfessional: boolean = false;
  isProfileRoute: boolean = false; // Nova variável para verificar a rota
  profileActiveColor: boolean = false;

  private subscriptionCliente: Subscription = new Subscription();
  private subscriptionPrestador: Subscription = new Subscription();

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;
  isEndFlow: boolean = false;
  isMenuExpanded: boolean = true;
  isHovered: boolean = false;
  constructor(
    public router: Router,
    public authService: AuthService,
    public stateManagementService: StateManagementService
  ) {
    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Verifica se a URL começa com alguma das rotas em hiddenRoutes
        this.showDiv = !this.hiddenRoutes.some((route) =>
          event.url.startsWith(route)
        );
        // Verifica se a última palavra da URL é "professional"
        const urlSegments = event.url.split('=');
        this.isProfileRoute =
          urlSegments[urlSegments.length - 1] === 'professional';

        if (
          event.url.includes('end') ||
          event.url.includes('detail') ||
          event.url.includes('help') ||
          event.url.includes('budgets')
        ) {
          this.isEndFlow = true;
        } else {
          this.isEndFlow = false;
        }
      });

    // Verifica a rota atual e atualiza a variável showMenu
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });

    this.router.events.subscribe(() => {
      this.profileActiveColor = this.router.url.includes('/profile');
    });
  }

  ngOnInit(): void {
    // Inscreve-se no estado de login
    this.subscriptionPrestador.add(
      this.authService.isPrestadorLoggedIn$.subscribe((loggedIn) => {
        this.prestadorIsLogged = loggedIn;
      })
    );
    this.subscriptionCliente.add(
      this.authService.isClienteLoggedIn$.subscribe((loggedIn) => {
        this.clienteIsLogged = loggedIn;
      })
    );
  }

  goToProfile() {
    const currentUrl = this.router.url;
    this.stateManagementService.clearState('publicado');
    this.stateManagementService.clearState('finalizado');
    // this.stateManagementService.clearState('andamento');

    // Verifica se já está na rota correta com o parâmetro
    if (currentUrl === '/profile?param=professional') {
      return; // Não navega novamente
    }

    // Navega para a rota com o parâmetro correto
    if (this.isProfessional) {
      this.router.navigate(['/profile'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/profile']);
    }
  }

  switchRoute(route: string) {
    // Evita navegação redundante
    const currentRoute = this.router.url.replace('/', '');
    const cleanRoute = route.replace('/', '');

    if (currentRoute === cleanRoute) return;

    // Se não for a rota home, limpa o cache
    if (cleanRoute !== 'home') {
      this.stateManagementService.clearState('publicado');
      this.stateManagementService.clearState('finalizado');
    }

    this.router.navigate([route]);
  }

  toggleMenu(): void {
    this.isMenuExpanded = !this.isMenuExpanded;
  }

  hoverMenu(isHovered: boolean): void {
    this.isHovered = isHovered;
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
