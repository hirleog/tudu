import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AuthHelper } from '../../helpers/auth-helper';
import { Subscription } from 'rxjs';

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

  constructor(private router: Router, public authService: AuthService) {
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

        this.isEndFlow = event.url.includes('end');
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
  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
