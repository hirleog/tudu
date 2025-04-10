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
  private subscriptions: Subscription = new Subscription();

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
      });

    // Verifica a rota atual e atualiza a variável showMenu
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('tudu-professional');
    });
  }

  ngOnInit(): void {
    // Inscreve-se no estado de login
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLogged = loggedIn;
      })
    );
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptions.unsubscribe();
  }
}
