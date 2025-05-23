import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';

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
  id_cliente!: string | null;
  prestadorId!: string | null;
  userId!: number;
  profileData: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private profileDetailService: ProfileDetailService
  ) {
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

    this.authService.idCliente$.subscribe((id) => {
      this.id_cliente = id;
    });

    this.authService.idPrestador$.subscribe((id) => {
      this.prestadorId = id;
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    let getFn: any;

    if (this.isProfessional === true) {
      this.userId = Number(this.prestadorId);
      getFn = this.profileDetailService.getPrestadorById;
    } else {
      this.userId = Number(this.id_cliente);
      getFn = this.profileDetailService.getClienteById;
    }

    getFn
      .call(this.profileDetailService, this.userId)
      .subscribe((data: any) => {
        this.profileData = data;
      });
  }

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

        //else temporario para forçar deslogar o prestador e cliente
      } else {
        this.authService.logoutCliente();
        this.router.navigate(['/']);
      }
    }
  }

  goToProfileDetail() {
    const currentUrl = this.router.url;

    // Verifica se já está na rota correta com o parâmetro
    // if (currentUrl === '/home/profile?param=professional') {
    //   return; // Não navega novamente
    // }

    // Navega para a rota com o parâmetro correto
    if (this.isProfessional) {
      this.router.navigate(['/home/profile-detail'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/home/profile-detail']);
    }
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
