import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isProfessional: boolean = false;

  private subscriptionCliente: Subscription = new Subscription();
  private subscriptionPrestador: Subscription = new Subscription();

  clienteIsLogged: boolean = false;
  prestadorIsLogged: boolean = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });

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

  ngOnInit(): void {}

  changeUserFlow(): void {
    // const role = this.authService.getRole();

    if (this.isProfessional === true) {
      this.handlePrestadorFlow();
    } else if (this.isProfessional === false) {
      this.handleClienteFlow();
    } else {
      console.error('Role desconhecido. Não foi possível determinar o fluxo.');
    }
  }

  private handlePrestadorFlow(): void {
    if (!this.clienteIsLogged) {
      alert('Você precisa fazer login como cliente para continuar.');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private handleClienteFlow(): void {
    if (!this.prestadorIsLogged) {
      alert('Você precisa fazer login como prestador para continuar.');
      this.router.navigate(['/login'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/tudu-professional/home']);
    }
  }

  logout() {
    if (this.authService.getRolePrestador() === 'prestador') {
      this.authService.logoutPrestador();
      this.router.navigate(['/']);
    } else {
      this.authService.logoutCliente();
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
