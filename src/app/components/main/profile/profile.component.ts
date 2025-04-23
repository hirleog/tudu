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
    const isClienteLogged = this.authService.isClienteLoggedIn();
    const isPrestadorLogged = this.authService.isPrestadorLoggedIn();

    if (this.isProfessional) {
      // Fluxo de prestador
      if (isPrestadorLogged) {
        this.authService.logoutPrestador();
        if (isClienteLogged) {
          // Se o cliente também estiver logado, redireciona para o fluxo do cliente
          this.router.navigate(['/']);
        } else {
          // Se apenas o prestador estava logado, redireciona para a página inicial
          this.router.navigate(['/login']);
        }
      }
    } else {
      // Fluxo de cliente
      if (isClienteLogged) {
        this.authService.logoutCliente();
        if (isPrestadorLogged) {
          // Se o prestador também estiver logado, redireciona para o fluxo do prestador
          this.router.navigate(['/tudu-professional/home']);
        } else {
          // Se apenas o cliente estava logado, redireciona para a página inicial
          this.router.navigate(['/']);
        }
      }
    }
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
