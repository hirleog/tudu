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
import { SharedService } from './shared/shared.service';
import { combineLatest } from 'rxjs';

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

  constructor(
    private router: Router,
    public pagbankService: PagbankService,
    public sharedService: SharedService
  ) {
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

    this.recuperarTransacaoPendente();

    // const isProfessional = this.router.url.includes('professional');
    // const root = document.documentElement;

    // if (isProfessional) {
    //   root.style.setProperty('--primary', 'blueviolet'); // Tema profissional
    // } else {
    //   root.style.setProperty('--primary', '#f80e6e'); // Tema cliente
    // }
    // localStorage.setItem('temaEscuro', JSON.stringify(isProfessional));

    // mostra modal de pix mediante ao pagamento ser varificado e o card em questão ser atualizado
    // combineLatest([
    //   this.pagbankService.statusPagamento$, // Canal 1
    //   this.sharedService.updatedCard$, // Canal 2
    // ]).subscribe(([status, cardPronto]) => {
    //   console.log('Sincronia Global:', { status, cardPronto });

    //   if (status === 'paid' && cardPronto) {
    //     this.showSuccessModal = true;
    //     this.customModal.openModal();
    //     this.customModal.configureModal(
    //       'success',
    //       'Pagamento pix aprovado com sucesso!'
    //     );

    //     // Limpa para não abrir o modal de novo
    //     this.pagbankService.pararMonitoramento();
    //   }
    // });

    // this.pagbankService.statusPagamento$.subscribe((status) => {
    //   if (status === 'paid') {
    //     // Ação que ocorre na aplicação toda:
    //     this.showSuccessModal = true;
    //     this.customModal.openModal();
    //     this.customModal.configureModal(
    //       'success',
    //       'Pagamento pix aprovado com sucesso!'
    //     );
    //   }
    //   this.sharedService.clearSuccessPixStatus();
    //   this.pagbankService.pararMonitoramento();
    // });

    this.pagbankService.statusPagamento$.subscribe((status) => {
      // Se o pagamento expirou ou foi cancelado, limpamos o storage para não travar o F5
      if (status === 'expired' || status === 'canceled') {
        localStorage.removeItem('pending_pix_transaction');
        this.pagbankService.pararMonitoramento();
        return;
      }

      if (status === 'paid') {
        // 1. PRIMEIRO: Começamos a ouvir o sinal de conclusão
        const sub = this.sharedService.updateFinalizado$.subscribe(
          (sucesso) => {
            if (sucesso) {
              this.showSuccessModal = true;
              this.customModal.openModal();
              this.customModal.configureModal(
                'success',
                'Pagamento e pedido confirmados!'
              );
            } else {
              alert(
                'Pagamento aprovado, mas houve um erro ao atualizar seu pedido. Entre em contato com o suporte.'
              );
            }
            sub.unsubscribe();
          }
        );

        // 2. DEPOIS: Damos a ordem e limpamos o monitoramento/storage
        this.sharedService.requestUpdate();
        localStorage.removeItem('pending_pix_transaction');
        this.pagbankService.pararMonitoramento();
      }
    });
  }

  recuperarTransacaoPendente() {
    const saved = localStorage.getItem('pending_pix_transaction');
    if (saved) {
      const data = JSON.parse(saved);
      console.log(
        'F5 Detectado! Recuperando monitoramento do Pix:',
        data.pixOrderId
      );

      // Reabastece o SharedService (que foi limpo pelo F5)
      this.sharedService.setUpdatedCardPayload(
        data.id_pedido,
        data.payloadCard
      );

      // Reinicia o monitoramento no Service
      this.pagbankService.monitorarPagamentoGlobal(data.pixOrderId).subscribe();
    }
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
