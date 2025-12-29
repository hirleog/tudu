import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

// import { SwUpdate } from '@angular/service-worker';

import * as AOS from 'aos';
import { PagbankService } from './services/pagbank.service';
import { CustomModalComponent } from './shared/custom-modal/custom-modal.component';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'absolute', width: '100%' }),
          { optional: true }
        ),
        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({ opacity: 0, transform: 'translateX(-10%)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateX(10%)' }),
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateX(0%)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  showInstallButton = false;
  title = 'automotive-services';
  showHomeMobile: boolean = true;
  deferredPrompt: any; // Allows to show the install prompt
  setupButton: any;
  logoUrl: string = 'assets/logo.png'; // Caminho padrão
  showSuccessModal: boolean = false;

  constructor(private router: Router, public pagbankService: PagbankService) {
    this.themas();
  }

  ngOnInit() {
    AOS.init();

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      console.log('beforeinstallprompt fired');
      if (this.setupButton == undefined) {
        this.setupButton = document.getElementById('setup_button');
      }
      // Show the setup button
      // this.setupButton.style.display = 'inline';
      this.setupButton.disabled = false;
    });

    // const isProfessional = this.router.url.includes('professional');
    // const root = document.documentElement;

    // if (isProfessional) {
    //   root.style.setProperty('--primary', 'blueviolet'); // Tema profissional
    // } else {
    //   root.style.setProperty('--primary', '#f80e6e'); // Tema cliente
    // }
    // localStorage.setItem('temaEscuro', JSON.stringify(isProfessional));

    this.pagbankService.statusPagamento$
      .pipe(
        filter((status) => status === 'paid'), // Só age quando for pago
        take(1) // Garante que o código do modal só rode uma vez
      )
      .subscribe(() => {
        this.customModal.openModal();
        this.customModal.configureModal(
          'success',
          'Pagamento pix aprovado com sucesso!'
        );

        // O Polling já parou sozinho lá no service por causa do takeWhile(..., true)
      });
  }

  goToHome(event: any) {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

  handleModalAction(event: any) {
    this.showSuccessModal = false;
    this.router.navigate(['/home/progress']);
  }

  installApp() {
    // Show the prompt
    this.deferredPrompt.prompt();
    this.setupButton.disabled = true;
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA setup accepted');
        // hide our user interface that shows our A2HS button
        this.setupButton.style.display = 'none';
      } else {
        console.log('PWA setup rejected');
      }
      this.deferredPrompt = null;
    });
  }

  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }

  themas() {
    // METODO PARA ALTERAR A COR DO THEMA E LOGO DO PROFESSIONAL MFE
    this.router.events.subscribe((event) => {
      const root = document.documentElement;
      if (event instanceof NavigationEnd) {
        if (
          event.url.startsWith('/tudu-professional') ||
          event.url.includes('professional') ||
          event.url.includes('historic') ||
          event.url.includes('prestadores')
        ) {
          root.style.setProperty('--primary', '#8a2be2');
          root.style.setProperty('--primary-dark', '#631fa3');
        } else {
          root.style.setProperty('--primary', '#f80e6e');
          root.style.setProperty('--primary-dark', '#b00a4e');
        }
      }

      // ...dentro do subscribe do router.events...
      if (event instanceof NavigationEnd) {
        // Checa se há tema salvo
        const temaSalvo = localStorage.getItem('temaEscuro');
        if (temaSalvo !== null && JSON.parse(temaSalvo) === true) {
          // Aplica tema escuro
          document.documentElement.style.setProperty('--light', '#333333');
          document.documentElement.style.setProperty('--secondary', '#ffffff');
          document.documentElement.style.setProperty('--tab-link', '#ffffff');
          document.documentElement.style.setProperty(
            '--secondary-transparent',
            '#ffffff'
          );
          document.documentElement.style.setProperty('--background', '#000000');
          root.style.setProperty('--bottom-transparent', '#ffffff3a'); // Tema escuro
        } else {
          // Aplica tema claro
          document.documentElement.style.setProperty('--light', '#ffffff');
          document.documentElement.style.setProperty('--secondary', '#4b4b4b');
          document.documentElement.style.setProperty('--tab-link', '#999');
          document.documentElement.style.setProperty(
            '--secondary-transparent',
            '#00000079'
          );
          document.documentElement.style.setProperty('--background', '#ffffff');
          root.style.setProperty('--bottom-transparent', '#00000021'); // Tema escuro
        }

        // ...demais lógicas de cor/tema específicas do fluxo (ex: tudu-professional)...
      }
    });
  }
}
