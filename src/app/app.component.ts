import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

// import { SwUpdate } from '@angular/service-worker';

import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-10%)' }))], { optional: true }),
          query(':enter', [style({ opacity: 0, transform: 'translateX(10%)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))], { optional: true })
        ])
      ])
    ])
  ]
})


export class AppComponent implements OnInit {
  title = 'automotive-services';
  showHomeMobile: boolean = true;
  hiddenRoutes: string[] = ['/showcase', '/proposal', '/offer', '/address', 'login'];

  constructor(
    private router: Router,
    // private swUpdate: SwUpdate

  ) {
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {
    //     if (confirm('Nova versão disponível! Atualizar agora?')) {
    //       window.location.reload();
    //     }
    //   });
    // }
  }


  ngOnInit() {
    AOS.init();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica se a rota ativa está no array de rotas ocultas
        this.showHomeMobile = !this.hiddenRoutes.some(route => event.url.includes(route));
      }
    });
  }

  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }
}