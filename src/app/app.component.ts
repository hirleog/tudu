import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'automotive-services';
  showHomeMobile: boolean = true;
  hiddenRoutes: string[] = ['/showcase', '/proposal', '/offer', '/address', 'login'];

  constructor(private router: Router) { }


  ngOnInit() {
    AOS.init();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica se a rota ativa está no array de rotas ocultas
        this.showHomeMobile = !this.hiddenRoutes.some(route => event.url.includes(route));
      }
    });
  }
}