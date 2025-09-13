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
  temaEscuro = false;

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
    // Lê o tema salvo no localStorage e aplica ao iniciar
    const temaSalvo = localStorage.getItem('temaEscuro');
    if (temaSalvo !== null) {
      this.temaEscuro = JSON.parse(temaSalvo);
      this.aplicarTema();
    } else {
      this.aplicarTema();
    }
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
    // CORREÇÃO: Se estou no fluxo professional e quero ir para cliente,
    // preciso verificar se o CLIENTE está logado para fazer a troca
    if (this.clienteIsLogged) {
      // Cliente está logado → pode trocar para área do cliente
      this.router.navigate(['/']);
    } else {
      // Cliente NÃO está logado → pede para fazer login como cliente
      alert('Você precisa fazer login como cliente para continuar.');
      this.router.navigate(['/login']);
    }
  }

  private handleClienteFlow(): void {
    // CORREÇÃO: Se estou no fluxo cliente e quero ir para professional,
    // preciso verificar se o PRESTADOR está logado para fazer a troca
    if (this.prestadorIsLogged) {
      // Prestador está logado → pode trocar para área professional
      this.router.navigate(['/tudu-professional/home']);
    } else {
      // Prestador NÃO está logado → pede para fazer login como prestador
      alert('Você precisa fazer login como prestador para continuar.');
      this.router.navigate(['/login'], {
        queryParams: { param: 'professional' },
      });
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
          this.router.navigate(['/']);
        }
      }
    } else {
      // Fluxo de cliente
      if (isClienteLogged) {
        this.authService.logoutCliente();
        if (isPrestadorLogged) {
          // Se o prestador também estiver logado, redireciona para o fluxo do prestador
          this.router.navigate(['/']);
        } else {
          // Se apenas o cliente estava logado, redireciona para a página inicial
          this.router.navigate(['/']);
        }
      }
      //else temporario para forçar deslogar o prestador e cliente
      // else {
      //   this.authService.logoutCliente();
      //   this.router.navigate(['/']);
      // }
    }
  }

  goToProfileDetail() {
    const currentUrl = this.router.url;

    // Navega para a rota com o parâmetro correto
    if (this.isProfessional) {
      this.router.navigate(['/profile/profile-detail'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/profile/profile-detail']);
    }
  }

  goToFinancial() {
    if (this.isProfessional) {
      this.router.navigate(['/tudu-professional/finances'], {
        queryParams: { param: 'professional' },
      });
    }
    // else {
    //   this.router.navigate(['/financial']);
    // }
  }

  alternarTema() {
    this.temaEscuro = !this.temaEscuro;
    localStorage.setItem('temaEscuro', JSON.stringify(this.temaEscuro));
    this.aplicarTema();
  }

  cleanThema() {
    localStorage.removeItem('temaEscuro');
    console.log('them limpo');
  }

  aplicarTema() {
    const root = document.documentElement;
    if (this.temaEscuro) {
      root.style.setProperty('--light', '#333333'); // Tema escuro
      root.style.setProperty('--secondary', '#ffffff'); // Tema escuro
      root.style.setProperty('--tab-link', '#ffffff'); // Tema escuro
      root.style.setProperty('--secondary-transparent', '#ffffff'); // Tema escuro
      root.style.setProperty('--background', '#000000'); // Tema escuro
      root.style.setProperty('--bottom-transparent', '#ffffff3a'); // Tema escuro

      root.style.setProperty('--skeleton-from', '#d1d5db');
      root.style.setProperty('--skeleton-via', '#f3f4f6');
      root.style.setProperty('--skeleton-to', '#d1d5db');
    } else {
      root.style.setProperty('--light', '#ffffff'); // Tema claro
      root.style.setProperty('--secondary', '#4b4b4b'); // Tema claro
      root.style.setProperty('--tab-link', '#999'); // Tema claro
      root.style.setProperty('--secondary-transparent', '#00000079'); // Tema escuro
      root.style.setProperty('--background', '#ffffff'); // Tema escuro
      root.style.setProperty('--bottom-transparent', '#00000021'); // Tema escuro

      root.style.setProperty('--skeleton-from', '#374151');
      root.style.setProperty('--skeleton-via', '#4b5563');
      root.style.setProperty('--skeleton-to', '#374151');
    }
  }

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    this.subscriptionPrestador.unsubscribe();
  }
}
